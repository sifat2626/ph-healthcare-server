import { Request, Response } from "express"
import { UserService } from "./user.service"
import { uploadToCloudinary } from "../../../helpers/fileUploader"
import catchAsync from "../../../shared/catchAsync"

const createAdmin = async (req: Request, res: Response) => {
  try {
    const payload = JSON.parse(req.body.data)
    const file = req.file

    if (file) {
      const upload = await uploadToCloudinary(file)
      payload.profilePhoto = upload?.secure_url
    }

    const result = await UserService.createAdmin(payload)

    res.status(200).json({
      message: "Admin created successfully",
      data: result,
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to create admin",
      error: error instanceof Error ? error.message : "Unknown error",
      success: false,
    })
  }
}

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = JSON.parse(req.body.data)
  const file = req.file

  if (file) {
    const upload = await uploadToCloudinary(file)
    payload.profilePhoto = upload?.secure_url
  }

  const result = await UserService.createDoctor(payload)

  res.status(200).json({
    message: "Doctor created successfully",
    data: result,
    success: true,
  })
})

const createPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = JSON.parse(req.body.data)
  const file = req.file

  if (file) {
    const upload = await uploadToCloudinary(file)
    payload.profilePhoto = upload?.secure_url
  }

  const result = await UserService.createPatient(payload)

  res.status(200).json({
    message: "Patient created successfully",
    data: result,
    success: true,
  })
})

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
}
