import prisma from "../../../shared/prisma"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { generateToken, verifyToken } from "../../../helpers/jwtHelpers"
import { UserStatus } from "../../../../generated/prisma"
import config from "../../../config"

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
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
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
