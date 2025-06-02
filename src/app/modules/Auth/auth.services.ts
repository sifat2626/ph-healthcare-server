import prisma from "../../../shared/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const generateToken = (user: any, secret: string, expiresIn: any) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn,
    }
  )

  return token
}

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

export const AuthServices = {
  loginUser,
}
