import express, { Request, Response } from "express"
import { AdminService } from "./admin.service"
import { adminFilterableFields } from "./admin.constant"
import { pick } from "../../../shared/pick"
import { sendResponse } from "../../../shared/sendResponse"
import httpStatus from "http-status"

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filters = pick(req.query, adminFilterableFields)

    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

    const result = await AdminService.getAllAdmins(filters, options)
    sendResponse(res, {
      statusCode: httpStatus.OK,
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
    sendResponse(res, {
      statusCode: httpStatus.OK,
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
    sendResponse(res, {
      statusCode: httpStatus.OK,
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

const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await AdminService.deleteAdminFromDB(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Admin deleted successfully",
      success: true,
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Error deleting admin",
      success: false,
      error: error.message,
    })
  }
}

const softDeleteAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await AdminService.softDeleteAdminFromDB(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Admin soft-deleted successfully",
      success: true,
      data: result,
    })
  } catch (error: any) {
    res.status(500).json({
      message: "Error soft-deleting admin",
      success: false,
      error: error.message,
    })
  }
}

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
}
