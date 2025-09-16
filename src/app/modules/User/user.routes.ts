import express from "express"
import { userController } from "./user.controller"
import { UserRole } from "../../../../generated/prisma"
import { auth } from "../../middlewares/auth"
import { fileUploader } from "../../utils/fileUploader"
import { validateRequest } from "../../../shared/validateRequest"
import { userValidation } from "./user.validation"
import { parseBodyMiddleware } from "../../middlewares/parseBodyMiddleware"

const router = express.Router()

router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  parseBodyMiddleware,
  validateRequest(userValidation.createAdmin),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.createAdmin
)

router.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  parseBodyMiddleware,
  validateRequest(userValidation.createDoctor),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.createDoctor
)

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  parseBodyMiddleware,
  validateRequest(userValidation.createPatient),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  userController.createPatient
)

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  userController.getAllFromDB
)

export const userRoutes = router
