import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import { AuthServices } from "./auth.services"

const loginUser = catchAsync(async (req, res, next) => {
  const user = AuthServices.loginUser(req.body)

  sendResponse(res, {
    statusCode: 200,
    message: "User logged in successfully",
    data: user,
  })
})

export const AuthController = {
  loginUser,
}
