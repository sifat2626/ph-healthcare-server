import { Prisma, PrismaClient } from "../../../../../generated/prisma"
import { adminSearchableFields } from "./admin.constant"
const prisma = new PrismaClient()

const getAllAdmins = async (params: any, options: any) => {
  const { page = 1, limit = 10 } = options
  const { searchTerm, ...filterData } = params
  const andConditions: Prisma.AdminWhereInput[] = []

  if (searchTerm) {
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
  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip: (page - 1) * Number(limit),
    take: Number(limit),
  })
  return result
}

export const AdminService = {
  getAllAdmins,
}
