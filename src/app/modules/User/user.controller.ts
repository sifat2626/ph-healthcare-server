import { Request, Response } from "express"
import { UserService } from "./user.service"

const createAdmin = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createAdmin(req.body)

    res.status(200).json({
      message: "Admin created successfully",
      data: result,
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create admin",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    })
  }
}

export const UserController = {
  createAdmin,
}
