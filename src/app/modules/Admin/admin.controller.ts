import { Request, Response } from "express"
import { AdminService } from "./admin.service"

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await AdminService.getAllAdmins(req.query)
    res.status(200).json({
      message: "Admins retrieved successfully",
      data: admins,
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve admins",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    })
  }
}

export const AdminController = {
  getAllAdmins,
}
