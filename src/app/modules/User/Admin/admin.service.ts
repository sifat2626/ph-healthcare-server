import { Prisma, PrismaClient } from "../../../../../generated/prisma"
import { calculatePagination } from "../../../../shared/calculatePagination"
import { prisma } from "../../../../shared/prisma"
import { adminSearchableFields } from "./admin.constant"

const getAllAdmins = async (params: any, options: any) => {
  const { limit, skip, orderBy } = calculatePagination(options)
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
    skip,
    take: limit,
    orderBy,
  })
  return result
}

export const AdminService = {
  getAllAdmins,
}
