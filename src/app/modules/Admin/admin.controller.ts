import { NextFunction, Request, RequestHandler, Response } from "express"
import { AdminService } from "./admin.service"
import pick from "../../../shared/pick"
import { adminFilterableFields } from "./admin.constant"
import { json } from "stream/consumers"
import sendResponse from "../../../shared/sendResponse"

const getAllAdmins: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    next(error)
  }
}

const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const admin = await AdminService.getAdminById(id)

    sendResponse(res, {
      statusCode: 200,
      message: "Admin retrieved successfully",
      data: admin,
    })
  } catch (error) {
    next(error)
  }
}

const updateAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    next(error)
  }
}

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await AdminService.deleteAdmin(id)

    sendResponse(res, {
      statusCode: 200,
      message: "Admin deleted successfully",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

const softDeleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const updatedAdmin = await AdminService.softDeleteAdmin(id)

    sendResponse(res, {
      statusCode: 200,
      message: "Admin soft deleted successfully",
      data: updatedAdmin,
    })
  } catch (error) {
    next(error)
  }
}

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdmin,
  softDeleteAdmin,
}
