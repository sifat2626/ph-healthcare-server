import { Request, Response, NextFunction } from "express"

export const parseBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body?.data) {
    try {
      req.body = JSON.parse(req.body.data)
      console.log(req.body)
    } catch (error) {
      return res.status(400).json({ error: "Invalid JSON" })
    }
  }
  next()
}
