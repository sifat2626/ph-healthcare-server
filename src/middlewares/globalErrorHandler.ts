import { Request, Response, NextFunction } from "express"

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    message: error.message,
    error: error,
    success: false,
  })
}

export default globalErrorHandler
