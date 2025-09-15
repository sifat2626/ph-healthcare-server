import config from "../config"
import jwt from "jsonwebtoken"

export const generateToken = (user: {
  id: string
  email: string
  role: string
}) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwt.jwtSecret as string,
    {
      expiresIn: "5m",
      algorithm: "HS256",
    }
  )
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwt.refreshTokenSecret as string,
    {
      expiresIn: "70d",
      algorithm: "HS256",
    }
  )
  return { accessToken, refreshToken }
}

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt.refreshTokenSecret as string
  ) as {
    userId: string
    email: string
    role: string
  }
  return decoded
}
