import { Request, Response } from "express"
import { AdminService } from "./admin.service"
import pick from "../../../shared/pick"
import { adminFilterableFields } from "./admin.constant"
import { json } from "stream/consumers"

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number
    message: string
    meta?: {
      page: number
      limit: number
      total: number
    }
    data: T | null | undefined
  }
) => {
  res.status(jsonData.statusCode).json({
    message: jsonData.message,
    meta: jsonData.meta || null || undefined,
    data: jsonData.data || null || undefined,
    success: true,
  })
}

const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields)
    const options = pick(req.query, ["sortBy", "sortOrder", "limit", "page"])
    const admins = await AdminService.getAllAdmins(filters, options)

    sendResponse(res, {
      statusCode: 200,
      message: "Admins retrieved successfully",
      meta: admins.meta,
      data: admins.data,
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

    sendResponse(res, {
      statusCode: 200,
      message: "Admin retrieved successfully",
      data: admin,
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

    sendResponse(res, {
      statusCode: 200,
      message: "Admin updated successfully",
      data: updatedAdmin,
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

    sendResponse(res, {
      statusCode: 200,
      message: "Admin deleted successfully",
      data: result,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete admin",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    })
  }
}

const softDeleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updatedAdmin = await AdminService.softDeleteAdmin(id)

    sendResponse(res, {
      statusCode: 200,
      message: "Admin soft deleted successfully",
      data: updatedAdmin,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to soft delete admin",
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
  softDeleteAdmin,
}
