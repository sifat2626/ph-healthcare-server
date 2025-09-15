import express from "express"
import { userController } from "./user.controller"
import multer from "multer"
import { UserRole } from "../../../../generated/prisma"
import { auth } from "../../middlewares/auth"

const router = express.Router()

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
