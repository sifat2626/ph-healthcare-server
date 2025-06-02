import { NextFunction, Request, RequestHandler, Response } from "express"
import { AdminService } from "./admin.service"
import pick from "../../../shared/pick"
import { adminFilterableFields } from "./admin.constant"
import { json } from "stream/consumers"
import sendResponse from "../../../shared/sendResponse"

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

const getAllAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = pick(req.query, adminFilterableFields)
    const options = pick(req.query, ["sortBy", "sortOrder", "limit", "page"])
    const admins = await AdminService.getAllAdmins(filters, options)

    sendResponse(res, {
      statusCode: 200,
      message: "Admins retrieved successfully",
      meta: admins.meta,
      data: admins.data,
    })
  }
)

const getAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const admin = await AdminService.getAdminById(id)

    sendResponse(res, {
      statusCode: 200,
      message: "Admin retrieved successfully",
      data: admin,
    })
  }
)

const updateAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const data = req.body
    const updatedAdmin = await AdminService.updateAdminById(id, data)

    sendResponse(res, {
      statusCode: 200,
      message: "Admin updated successfully",
      data: updatedAdmin,
    })
  }
)

const deleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const result = await AdminService.deleteAdmin(id)

    sendResponse(res, {
      statusCode: 200,
      message: "Admin deleted successfully",
      data: result,
    })
  }
)

const softDeleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const updatedAdmin = await AdminService.softDeleteAdmin(id)

    sendResponse(res, {
      statusCode: 200,
      message: "Admin soft deleted successfully",
      data: updatedAdmin,
    })
  }
)

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdmin,
  softDeleteAdmin,
}
