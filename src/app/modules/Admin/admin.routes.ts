import express, { NextFunction, Request, Response } from "express"
import { AdminController } from "./admin.controller"
import { z, ZodObject, ZodError } from "zod"

const router = express.Router()

// Middleware to validate request with Zod schema
const validateRequest = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Wrap req.body inside an object called "body"
      await schema.parseAsync({ body: req.body })
      next()
    } catch (error) {
      next(error)
    }
  }
}

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
