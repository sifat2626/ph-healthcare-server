import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { AuthServices } from "./auth.services"

const loginUser = catchAsync(async (req, res, next) => {
  const user: any = AuthServices.loginUser(req.body)

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

export const AuthController = {
  loginUser,
}
