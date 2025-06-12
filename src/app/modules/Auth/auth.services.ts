import prisma from "../../../shared/prisma"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { generateToken, verifyToken } from "../../../helpers/jwtHelpers"
import { UserStatus } from "../../../../generated/prisma"
import config from "../../../config"
import ApiError from "../../Errors/apiError"
import e from "express"
import emailSender from "./emailSender"

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  })

  const isCorrectPassword = await bcrypt.compare(password, user.password)

  if (!isCorrectPassword) {
    throw new ApiError(401, "Invalid email or password")
  }

  const accessToken = generateToken(
    user,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  )

  const refreshToken = generateToken(
    user,
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  )

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  }
}

const refreshToken = async (token: string) => {
  let decodedData
  try {
    decodedData = verifyToken(
      token,
      config.jwt.refresh_token_secret as string
    ) as JwtPayload
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token")
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: decodedData.id, status: UserStatus.ACTIVE },
  })
  if (!user) {
    throw new ApiError(404, "User not found")
  }

  const accessToken = generateToken(
    user,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  )

  return {
    accessToken,
    needsPasswordChange: user.needsPasswordChange,
  }
}

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId, status: UserStatus.ACTIVE },
  })

  const isCorrectPassword = await bcrypt.compare(oldPassword, user.password)

  if (!isCorrectPassword) {
    throw new ApiError(401, "Old password is incorrect")
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10)

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedNewPassword,
      needsPasswordChange: false,
    },
  })

  return updatedUser
}

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email, status: UserStatus.ACTIVE },
  })
  if (!user) {
    throw new ApiError(404, "User not found")
  }

  const resetPasswordToken = generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.reset_password_secret as string,
    config.jwt.reset_password_expires_in as string
  )

  const resetPasswordLink = `${config.reset_password_link}?userId=${user.id}&token=${resetPasswordToken}`
  await emailSender(
    user.email,
    "Reset Password",
    `
    <div>
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <button style="background-color:rgb(187, 223, 188); color: white; padding: 10px 20px; border: none; border-radius: 5px;">
      <a href="${resetPasswordLink}" style="color: white; text-decoration: none;">Reset Password</a>
      </button>
      <p>If you did not request this, please ignore this email.</p>
    </div>
    `
  )

  // return resetPasswordLink
}

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
}
