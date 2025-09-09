import { userService } from "./user.service"
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.createAdmin(req.body)
    res.status(httpStatus.OK).json({
      message: "Admin created successfully",
      success: true,
      data: result,
    })
  } catch (error: any) {
    next(error)
  }
}

export const userController = {
  createAdmin,
}
