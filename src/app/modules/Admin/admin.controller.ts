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
      meta: admins.meta,
      data: admins.data,
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

const getAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const admin = await AdminService.getAdminById(id)
    res.status(200).json({
      message: "Admin retrieved successfully",
      data: admin,
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve admin",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    })
  }
}

const updateAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const data = req.body
    const updatedAdmin = await AdminService.updateAdminById(id, data)
    res.status(200).json({
      message: "Admin updated successfully",
      data: updatedAdmin,
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to update admin",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    })
  }
}

const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await AdminService.deleteAdmin(id)
    res.status(200).json({
      message: "Admin deleted successfully",
      data: result,
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete admin",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    })
  }
}

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdmin,
}
