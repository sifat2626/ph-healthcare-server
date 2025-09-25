import { userService } from "./user.service"
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"
import { catchAsync } from "../../../shared/catchAsync"
import { pick } from "../../../shared/pick"
import { sendResponse } from "../../../shared/sendResponse"
import { userFilterableFields } from "./user.constant"
import { UserRole } from "../../../../generated/prisma"

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin(req)
  res.status(httpStatus.OK).json({
    message: "Admin created successfully",
    success: true,
    data: result,
  })
})

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createDoctor(req)
  res.status(httpStatus.OK).json({
    message: "Doctor created successfully",
    success: true,
    data: result,
  })
})

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createPatient(req)
  res.status(httpStatus.OK).json({
    message: "Patient created successfully",
    success: true,
    data: result,
  })
})

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields)

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])

  const result = await userService.getAllUsers(filters, options)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    success: true,
    meta: result.meta,
    data: result.data,
  })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body
  const result = await userService.updateUserStatus(id, status)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User status updated successfully",
    success: true,
    data: result,
  })
})

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id
  const role = req.user.role
  const result = await userService.getMyProfile(userId, role)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    success: true,
    data: result,
  })
})

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  updateUserStatus,
  getMyProfile,
  getAllFromDB,
}
