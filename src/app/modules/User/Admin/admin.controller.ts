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
      meta: result.meta,
      data: result.data,
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Error retrieving admins",
      success: false,
      error: error.message,
    })
  }
}

const getByIdFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await AdminService.getByIdFromDB(id)
    if (!result) {
      return res.status(404).json({
        message: "Admin not found",
        success: false,
      })
    }
    res.status(200).json({
      message: "Admin retrieved successfully",
      success: true,
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Error retrieving admin",
      success: false,
      error: error.message,
    })
  }
}

const updateAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const payload = req.body
    const result = await AdminService.updateAdminToDB(id, payload)
    res.status(200).json({
      message: "Admin updated successfully",
      success: true,
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating admin",
      success: false,
      error: error.message,
    })
  }
}

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateAdmin,
}
