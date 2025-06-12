import { Secret } from "jsonwebtoken"
import { verifyToken } from "../helpers/jwtHelpers"
import { NextFunction, Request, Response } from "express"
import ApiError from "../app/Errors/apiError"

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        throw new ApiError(401, "you are not authorized")
      }

      const verifiedUser: any = verifyToken(
        token,
        process.env.JWT_SECRET as Secret
      )

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(
          403,
          "you are not authorized to access this resource"
        )
      }
      req.user = verifiedUser
      next()
    } catch (error) {}
  }
}

export default auth
