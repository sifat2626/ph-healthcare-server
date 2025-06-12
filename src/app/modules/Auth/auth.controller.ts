import { NextFunction, Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { AuthServices } from "./auth.services"

const loginUser = catchAsync(async (req, res, next) => {
  const user: any = await AuthServices.loginUser(req.body)

  const { refreshToken } = user

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "strict", // Adjust based on your requirements
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  })

  sendResponse(res, {
    statusCode: 200,
    message: "User logged in successfully",
    data: {
      accessToken: user.accessToken,
      needsPasswordChange: user.needsPasswordChange,
    },
  })
})

const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies

  const result = await AuthServices.refreshToken(refreshToken)

  sendResponse(res, {
    statusCode: 200,
    message: "Refresh token retrieved successfully",
    data: result,
  })
})

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const userId = req.user.id
    const { oldPassword, newPassword } = req.body
    const updatedUser = await AuthServices.changePassword(
      userId,
      oldPassword,
      newPassword
    )
    sendResponse(res, {
      statusCode: 200,
      message: "Password changed successfully",
      data: updatedUser,
    })
  }
)

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body
  const result = await AuthServices.forgotPassword(email)
  sendResponse(res, {
    statusCode: 200,
    message: "Password reset link sent successfully",
    data: result,
  })
})

const resetPassword = catchAsync(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const { userId, token, password } = req.body
    const updatedUser = await AuthServices.resetPassword(
      token,
      userId,
      password
    )
    sendResponse(res, {
      statusCode: 200,
      message: "Password reset successfully",
      data: updatedUser,
    })
  }
)

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
}
