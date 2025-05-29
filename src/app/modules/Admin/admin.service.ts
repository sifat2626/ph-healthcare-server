import { Prisma, PrismaClient } from "../../../../generated/prisma"

const prisma = new PrismaClient()

const getAllAdmins = async (params: any) => {
  const { searchTerm, ...filterData } = params
  const andConditions: Prisma.AdminWhereInput[] = []
  const adminSearchableFields = ["name", "email"]

  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    })
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    })
  }

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }
  const admins = await prisma.admin.findMany({
    where: whereConditions,
  })
  return admins
}

export const AdminService = {
  getAllAdmins,
}
