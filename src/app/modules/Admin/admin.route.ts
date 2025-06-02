import express, { Request, Response, NextFunction } from "express"
import { AnyZodObject, z } from "zod"
import { AdminController } from "./admin.controller"
import validateRequest from "../../../middlewares/validateRequest"
import { AdminValidationSchemas } from "./admin.validations"
const router = express.Router()

router.get("/", AdminController.getAllAdmins)
router.get("/:id", AdminController.getAdminById)
router.patch(
  "/:id",
  validateRequest(AdminValidationSchemas.update),
  AdminController.updateAdminById
)
router.delete("/:id", AdminController.deleteAdmin)
router.patch("/soft-delete/:id", AdminController.softDeleteAdmin)

export const AdminRoutes = router
