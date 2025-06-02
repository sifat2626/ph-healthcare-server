import jwt from "jsonwebtoken"

export const generateToken = (user: any, secret: string, expiresIn: any) => {
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
