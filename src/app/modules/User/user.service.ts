import { PrismaClient, UserRole } from "../../../../generated/prisma"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

const createAdmin = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 12)
  const userData = {
    email: data.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  }

  const result = await prisma.$transaction(async (tx) => {
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
