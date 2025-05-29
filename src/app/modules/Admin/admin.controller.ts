import { Request, Response } from "express"
import { AdminService } from "./admin.service"
import pick from "../../../shared/pick"
import { adminFilterableFields } from "./admin.constant"

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields)
    const options = pick(req.query, ["sortBy", "sortOrder", "limit", "page"])
    const admins = await AdminService.getAllAdmins(filters, options)
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
