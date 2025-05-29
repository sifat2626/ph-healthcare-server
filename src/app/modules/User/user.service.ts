import { PrismaClient, UserRole } from "../../../../generated/prisma"

const prisma = new PrismaClient()

const createAdmin = async (payload: any) => {
  const userData = {
    email: payload.admin.email,
    password: payload.admin.password,
    role: UserRole.ADMIN,
  }

  const result = await prisma.$transaction(async (prisma) => {
    const createdUserData = await prisma.user.create({
      data: userData,
    })

    const createAdminData = await prisma.admin.create({
      data: payload.admin,
    })
  })

  return {
    data: payload,
  }
}

export const UserService = {
  createAdmin,
}
