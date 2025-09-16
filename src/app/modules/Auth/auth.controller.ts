import { Request, Response } from "express"
import { catchAsync } from "../../../shared/catchAsync"
import { sendResponse } from "../../../shared/sendResponse"
import { AuthService } from "./auth.service"

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body)

  const { refreshToken } = result
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })

  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: {
      accessToken: result.accessToken,
      needsPasswordChange: result.needsPasswordChange,
    },
    message: "User logged in successfully",
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  const result = await AuthService.refreshToken(refreshToken)
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
  sendResponse(res, {
    statusCode: 200,
    success: true,
    data: result.accessToken,
    message: "Token refreshed successfully",
  })
})

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id
    await AuthService.changePassword(userId, req.body)
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password changed successfully",
    })
  }
)

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body
  await AuthService.forgotPassword(email)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message:
      "If that email address is in our database, we will send you an email to reset your password.",
  })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body
  await AuthService.resetPassword(email, token, newPassword)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password has been reset successfully",
  })
})

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  resetPassword,
  forgotPassword,
}
