import { Request, Response } from "express"
import { UserService } from "./user.service"
import { uploadToCloudinary } from "../../../helpers/fileUploader"

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

export const UserController = {
  createAdmin,
}
