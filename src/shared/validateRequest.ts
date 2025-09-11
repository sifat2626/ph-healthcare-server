import { Request, Response, NextFunction } from "express"
import { ZodObject } from "zod"

// Middleware to validate request with Zod schema
export const validateRequest = (schema: ZodObject<any>) => {
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
