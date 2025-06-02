import prisma from "../../../shared/prisma"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { generateToken, verifyToken } from "../../../helpers/jwtHelpers"
import { UserStatus } from "../../../../generated/prisma"

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  })

  const isCorrectPassword = await bcrypt.compare(password, user.password)

  if (!isCorrectPassword) {
    throw new Error("Invalid email or password")
  }

  const accessToken = generateToken(
    user,
    "process.env.JWT_ACCESS_SECRET as string",
    "1h"
  )

  const refreshToken = generateToken(
    user,
    "process.env.JWT_REFRESH_SECRET as string",
    "7d"
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
      "process.env.JWT_REFRESH_SECRET as string"
    ) as JwtPayload
  } catch (error) {
    throw new Error("Invalid refresh token")
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: decodedData.id, status: UserStatus.ACTIVE },
  })
  if (!user) {
    throw new Error("User not found")
  }

  const accessToken = generateToken(
    user,
    "process.env.JWT_ACCESS_SECRET as string",
    "1h"
  )

  return {
    accessToken,
    needsPasswordChange: user.needsPasswordChange,
  }
}

export const AuthServices = {
  loginUser,
  refreshToken,
}
