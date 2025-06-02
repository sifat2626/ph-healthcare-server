import express, { Request, Response, NextFunction } from "express"
import { AdminController } from "./admin.controller"
const router = express.Router()

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log("Request validation logic here")
  next()
}

router.get("/", AdminController.getAllAdmins)
router.get("/:id", AdminController.getAdminById)
router.patch("/:id", validateRequest, AdminController.updateAdminById)
router.delete("/:id", AdminController.deleteAdmin)
router.patch("/soft-delete/:id", AdminController.softDeleteAdmin)

export const AdminRoutes = router
