import prisma from "../../../shared/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { generateToken } from "../../../helpers/jwtHelpers"

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

const refreshToken = async (token: string) => {}

export const AuthServices = {
  loginUser,
}
