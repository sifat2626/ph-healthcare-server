import { Prisma, PrismaClient } from "../../../../generated/prisma"
import calculatePagination from "../../../helpers/paginationHelper"
import { adminSearchableFields } from "./admin.constant"

const prisma = new PrismaClient()

const getAllAdmins = async (params: any, options: any) => {
  const { limit, page, skip } = calculatePagination(options)
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
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  })
  return admins
}

export const AdminService = {
  getAllAdmins,
}
