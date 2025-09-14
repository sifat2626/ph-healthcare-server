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

export const AuthController = {
  loginUser,
}
