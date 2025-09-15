import express from "express"
import { userController } from "./user.controller"
import multer from "multer"
import { UserRole } from "../../../../generated/prisma"
import { verifyToken } from "../../../shared/jwtHelpers"

const router = express.Router()

const auth = (...roles: string[]) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const token = req.headers.authorization
      if (!token) {
        throw new Error("You are not authorized")
      }

      const verifiedUser = verifyToken(token)
      if (!verifiedUser) {
        throw new Error("You are not authorized")
      }

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("You are not authorized")
      }

      // req.user = verifiedUser
      next()
    } catch (error) {
      next(error)
    }
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/my-uploads")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix)
  },
})

const upload = multer({ storage: storage })

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.createAdmin
)

export const userRoutes = router
