import express, { Request, Response } from "express"
import { UserController } from "./user.controller"
import { UserRole } from "../../../../generated/prisma"
import auth from "../../../middlewares/auth"
import { upload } from "../../../helpers/fileUploader"
import validateRequest from "../../../middlewares/validateRequest"
import { UserValidationSchemas } from "./user.validation"

const router = express.Router()

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(UserValidationSchemas.createAdmin),
  upload.single("file"),
  UserController.createAdmin
)

export const UserRoutes = router
