import express, { Request, Response, NextFunction } from "express"
import { AnyZodObject, z } from "zod"
import { AdminController } from "./admin.controller"
const router = express.Router()

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("Request validation logic here")
    next()
  }
}
const update = z.object({
  body: z.object({
    name: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
})

router.get("/", AdminController.getAllAdmins)
router.get("/:id", AdminController.getAdminById)
router.patch("/:id", validateRequest(update), AdminController.updateAdminById)
router.delete("/:id", AdminController.deleteAdmin)
router.patch("/soft-delete/:id", AdminController.softDeleteAdmin)

export const AdminRoutes = router
