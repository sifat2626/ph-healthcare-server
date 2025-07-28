import { PrismaClient, UserRole } from "../../../../generated/prisma"

const prisma = new PrismaClient()

const createAdmin = async (data: any) => {
  const userData = {
    email: data.email,
    password: data.password,
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
