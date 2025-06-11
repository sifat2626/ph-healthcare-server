import jwt, { Secret } from "jsonwebtoken"
import ApiError from "../app/Errors/apiError"

export const generateToken = (user: any, secret: Secret, expiresIn: any) => {
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

export const verifyToken = (token: string, secret: Secret) => {
  try {
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (error) {
    throw new ApiError(401, "Invalid token")
  }
}
