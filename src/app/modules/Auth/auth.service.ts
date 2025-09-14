import { prisma } from "../../../shared/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { generateToken, verifyToken } from "../../../shared/jwtHelpers"
import { UserStatus } from "../../../../generated/prisma"

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: { email: payload.email },
  })

  if (!userData) {
    throw new Error("User not found")
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    userData.password
  )
  if (!isPasswordValid) {
    throw new Error("Invalid password")
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
    throw new Error("Invalid refresh token")
  }

  const user = await prisma.user.findUnique({
    where: { id: decodedData.userId, status: UserStatus.ACTIVE },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const { accessToken, refreshToken } = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  })

  return { accessToken, refreshToken }
}

export const AuthService = {
  loginUser,
  refreshToken,
}
