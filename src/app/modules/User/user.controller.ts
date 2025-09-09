import { userService } from "./user.service"
import { Request, Response } from "express"
import httpStatus from "http-status"

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await userService.createAdmin(req.body)
    res.status(httpStatus.OK).json({
      message: "Admin created successfully",
      success: true,
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      message: error.name || "Error creating admin",
      success: false,
    })
  }
}

export const userController = {
  createAdmin,
}
