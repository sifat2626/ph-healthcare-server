import {
  Admin,
  Prisma,
  PrismaClient,
  UserStatus,
} from "../../../../generated/prisma"
import calculatePagination from "../../../helpers/paginationHelper"
import prisma from "../../../shared/prisma"
import ApiError from "../../Errors/apiError"
import { IPaginationOptions } from "../../interfaces/pagination"
import { adminSearchableFields } from "./admin.constant"
import { IAdminFilterRequest } from "./admin.interface"

const getAllAdmins = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
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
          equals: (filterData as any)[key],
        },
      })),
    })
  }

  andConditions.push({
    isDeleted: false,
  })

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

const getAdminById = async (id: string): Promise<Admin | null> => {
  const admin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  })
  if (!admin) {
    throw new ApiError(400, "Admin not found")
  }
  return admin
}

const updateAdminById = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id },
  })

  if (!existingAdmin) {
    throw new ApiError(400, "Admin not found")
  }

  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data,
  })

  return updatedAdmin
}

const deleteAdmin = async (id: string): Promise<Admin | null> => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id },
  })

  if (!existingAdmin) {
    throw new ApiError(400, "Admin not found")
  }

  const result = await prisma.$transaction(async (prisma) => {
    const deletedAdmin = await prisma.admin.delete({
      where: { id },
    })

    await prisma.user.delete({
      where: { email: existingAdmin.email },
    })

    return deletedAdmin
  })

  return result
}

const softDeleteAdmin = async (id: string) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  })
  if (!existingAdmin) {
    throw new ApiError(400, "Admin not found")
  }

  const result = await prisma.$transaction(async (prisma) => {
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    })
    await prisma.user.update({
      where: { email: existingAdmin.email },
      data: {
        status: UserStatus.DELETED,
      },
    })

    return updatedAdmin
  })

  return result
}

export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdmin,
  softDeleteAdmin,
}
