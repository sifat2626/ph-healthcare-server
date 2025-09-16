import bcrypt from "bcrypt"
import { prisma } from "../../../shared/prisma"
import { UserRole } from "../../../../generated/prisma"
import config from "../../../config"

const createAdmin = async (data: any) => {
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
