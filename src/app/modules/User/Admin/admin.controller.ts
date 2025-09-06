import express, { Request, Response } from "express"
import { AdminService } from "./admin.service"

const getAllFromDB = async (req: Request, res: Response) => {
  const result = await AdminService.getAllAdmins()
  res.status(200).json({
    message: "Admins retrieved successfully",
    success: true,
    data: result,
  })
}

export const AdminController = {
  getAllFromDB,
}
