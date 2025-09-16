import express, { NextFunction, Request, Response } from "express"
import { AdminController } from "./admin.controller"
import { z, ZodObject } from "zod"
import { validateRequest } from "../../../shared/validateRequest"
import { auth } from "../../middlewares/auth"
import { UserRole } from "../../../../generated/prisma"

const router = express.Router()

// Zod schema with "body" layer
const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
})

// Routes
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllFromDB
)
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getByIdFromDB
)
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(update),
  AdminController.updateAdmin
)
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.deleteAdmin
)
router.delete(
  "/soft-delete/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.softDeleteAdmin
)

export const AdminRoutes = router
