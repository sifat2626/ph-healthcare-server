import express, { Request, Response } from "express"
import { AdminService } from "./admin.service"
import { pick } from "../../../../shared/pick"
import { adminFilterableFields } from "./admin.constant"

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields)

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

    const result = await AdminService.getAllAdmins(filters, options)
    res.status(200).json({
      message: "Admins retrieved successfully",
      success: true,
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Error retrieving admins",
      success: false,
      error: error.message,
    })
  }
}

export const AdminController = {
  getAllFromDB,
}
