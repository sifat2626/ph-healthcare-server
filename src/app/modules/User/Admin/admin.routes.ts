import express from "express"
import { AdminController } from "./admin.controller"
const router = express.Router()

router.get("/", AdminController.getAllFromDB)
router.get("/:id", AdminController.getByIdFromDB)
router.patch("/:id", AdminController.updateAdmin)

export const AdminRoutes = router
