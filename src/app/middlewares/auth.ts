import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../../shared/jwtHelpers"
import ApiError from "../errors/ApiError"

export const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        throw new ApiError(401, "You are not authorized")
      }

      const verifiedUser = verifyToken(token)
      if (!verifiedUser) {
        throw new ApiError(401, "You are not authorized")
      }

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(403, "You are not authorized")
      }

      // req.user = verifiedUser
      next()
    } catch (error) {
      next(error)
    }
  }
}
