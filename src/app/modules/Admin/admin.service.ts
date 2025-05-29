import { PrismaClient } from "../../../../generated/prisma"

const prisma = new PrismaClient()

const getAllAdmins = async (params: any) => {
  const admins = await prisma.admin.findMany({
    where: {
      OR: [
        {
          name: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    },
  })
  return admins
}

export const AdminService = {
  getAllAdmins,
}
