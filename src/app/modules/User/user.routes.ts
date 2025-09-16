import express from "express"
import { userController } from "./user.controller"
import { UserRole } from "../../../../generated/prisma"
import { auth } from "../../middlewares/auth"
import { fileUploader } from "../../utils/fileUploader"

const router = express.Router()

router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.createAdmin
)

export const userRoutes = router
