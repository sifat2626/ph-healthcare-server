import { Prisma, PrismaClient } from "../../../../generated/prisma"
import { adminSearchableFields } from "./admin.constant"

const prisma = new PrismaClient()

const getAllAdmins = async (params: any, options: any) => {
  const { limit, page } = options
  const skip = (Number(page) - 1) * limit
  const take = limit
  const { searchTerm, ...filterData } = params
  const andConditions: Prisma.AdminWhereInput[] = []

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
    skip,
    take,
  })
  return admins
}

export const AdminService = {
  getAllAdmins,
}
