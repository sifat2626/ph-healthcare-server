import express, { Request, Response } from "express"
import { AdminService } from "./admin.service"

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllAdmins(req.query)
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
