import express, { NextFunction, Request, Response } from "express"
import { AdminController } from "./admin.controller"
import { z, ZodObject } from "zod"
import { validateRequest } from "../../../shared/validateRequest"

const router = express.Router()

// Zod schema with "body" layer
const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
})

// Routes
router.get("/", AdminController.getAllFromDB)
router.get("/:id", AdminController.getByIdFromDB)
router.patch("/:id", validateRequest(update), AdminController.updateAdmin)
router.delete("/:id", AdminController.deleteAdmin)
router.delete("/soft-delete/:id", AdminController.softDeleteAdmin)

export const AdminRoutes = router
