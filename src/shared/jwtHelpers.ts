import jwt from "jsonwebtoken"

export const generateToken = (user: {
  id: string
  email: string
  role: string
}) => {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "5m", algorithm: "HS256" }
  )
  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "30d", algorithm: "HS256" }
  )
  return { accessToken, refreshToken }
}
