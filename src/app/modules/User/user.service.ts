import bcrypt from "bcrypt"
import { prisma } from "../../../shared/prisma"
import { UserRole } from "../../../../generated/prisma"
import config from "../../../config"
import { fileUploader } from "../../utils/fileUploader"

const createAdmin = async (req: any) => {
  const data = JSON.parse(req.body.data)
  const file = req.file

  if (file) {
    const uploadedImageUrl = await fileUploader.uploadToCloudinary(file)
    data.admin.profilePicture = uploadedImageUrl
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    config.bcrypt.saltRounds
  )
  const userData = {
    email: data.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  }

  const result = await prisma.$transaction(async (tx: any) => {
    const createdUserData = await tx.user.create({
      data: userData,
    })

    const createdAdminData = await tx.admin.create({
      data: data.admin,
    })

    return {
      user: createdUserData,
      admin: createdAdminData,
    }
  })

  return result
}

export const userService = {
  createAdmin,
}
