import { prisma } from "../../../shared/prisma"
import bcrypt from "bcrypt"
import { generateToken, verifyToken } from "../../../shared/jwtHelpers"
import { UserStatus } from "../../../../generated/prisma"
import ApiError from "../../errors/ApiError"
import config from "../../../config"
import { sendEmail } from "../../utils/sendEmail"
const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: { email: payload.email },
  })

  if (!userData) {
    throw new ApiError(404, "User not found")
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    userData.password
  )
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password")
  }

  const { accessToken, refreshToken } = generateToken({
    id: userData.id,
    email: userData.email,
    role: userData.role,
  })

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: userData.needsPasswordChange,
  }
}

const refreshToken = async (token: string) => {
  const decodedData = verifyToken(token)

  if (!decodedData) {
    throw new ApiError(401, "Invalid refresh token")
  }

  const user = await prisma.user.findUnique({
    where: { id: decodedData.userId, status: UserStatus.ACTIVE },
  })

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  const { accessToken, refreshToken } = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  return { accessToken, refreshToken }
}

const changePassword = async (
  userId: string,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  const isPasswordValid = await bcrypt.compare(
    payload.oldPassword,
    user.password
  )
  if (isPasswordValid) {
    throw new ApiError(
      400,
      "Invalid old password. Please provide the correct current password."
    )
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    config.bcrypt.saltRounds
  )
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword, needsPasswordChange: false },
  })
}

const forgotPassword = async (email: string) => {
  // Implementation for forgot password functionality
  const user = await prisma.user.findUnique({
    where: { email, status: UserStatus.ACTIVE },
  })

  if (!user) {
    // For security reasons, we do not reveal whether the email exists or not
    return
  }

  const resetPasswordToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  const resetLink = `${config.client.url}/reset-password?email=${user.email}&token=${resetPasswordToken.accessToken}`
  // Send the reset link via email
  const emailSubject = "Password Reset Request"
  const emailBody = `
    <p>Dear ${user.email},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,<br/>Your Company Team</p>
  `
  await sendEmail(user.email, emailSubject, emailBody)
}

const resetPassword = async (
  email: string,
  token: string,
  newPassword: string
) => {
  // Implementation for resetting the password using the token
  const decodedData = verifyToken(token)

  if (!decodedData || decodedData.email !== email) {
    throw new ApiError(401, "Invalid or expired reset token")
  }
  const user = await prisma.user.findUnique({
    where: { email, status: UserStatus.ACTIVE },
  })
  if (!user) {
    throw new ApiError(404, "User not found")
  }
  const hashedPassword = await bcrypt.hash(
    newPassword,
    config.bcrypt.saltRounds
  )
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, needsPasswordChange: false },
  })
  return
}

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
}
