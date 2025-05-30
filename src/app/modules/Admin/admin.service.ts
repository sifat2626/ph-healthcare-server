import { Admin, Prisma, PrismaClient } from "../../../../generated/prisma"
import calculatePagination from "../../../helpers/paginationHelper"
import prisma from "../../../shared/prisma"
import { adminSearchableFields } from "./admin.constant"

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

  const total = await prisma.admin.count({
    where: whereConditions,
  })
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: admins,
  }
}

const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
  })
  if (!admin) {
    throw new Error("Admin not found")
  }
  return admin
}

const updateAdminById = async (id: string, data: Partial<Admin>) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id },
  })

  if (!existingAdmin) {
    throw new Error("Admin not found")
  }

  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data,
  })

  return updatedAdmin
}

const deleteAdmin = async (id: string) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id },
  })

  if (!existingAdmin) {
    throw new Error("Admin not found")
  }

  await prisma.$transaction(async (prisma) => {
    await prisma.admin.delete({
      where: { id },
    })

    await prisma.user.delete({
      where: { email: existingAdmin.email },
    })
  })

  return { message: "Admin deleted successfully" }
}
export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdmin,
}
