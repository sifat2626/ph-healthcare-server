import { prisma } from "../../../shared/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { generateToken } from "../../../shared/jwtHelpers"

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

export const AuthService = {
  loginUser,
}
