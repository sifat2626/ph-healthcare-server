import { userService } from "./user.service"
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { catchAsync } from "../../../shared/catchAsync"

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req.body)
  res.status(httpStatus.OK).json({
    message: "Admin created successfully",
    success: true,
    data: result,
  })
})

export const userController = {
  createAdmin,
}
