import { PrismaClient, UserRole } from "../../../../generated/prisma"
import * as bcrypt from "bcrypt"
import prisma from "../../../shared/prisma"

const createAdmin = async (payload: any) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10)
  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  }

  const result = await prisma.$transaction(async (prisma) => {
    const createdUserData = await prisma.user.create({
      data: userData,
    })

    const createdAdminData = await prisma.admin.create({
      data: payload.admin,
    })

    return createdAdminData
  })

  return result
}

export const UserService = {
  createAdmin,
}
