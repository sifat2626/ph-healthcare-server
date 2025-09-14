import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"

export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    message: error.message || "Something went wrong",
    success: false,
    error: error.message,
  })
}
