import { calculatePagination } from "../../../shared/calculatePagination"
import {
  Admin,
  Prisma,
  PrismaClient,
  UserStatus,
} from "../../../../generated/prisma"
import { adminSearchableFields } from "./admin.constant"
import { prisma } from "../../../shared/prisma"
import { IAdminFilterRequest } from "./admin.interface"
import ApiError from "../../errors/ApiError"

const getAllAdmins = async (params: IAdminFilterRequest, options: any) => {
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
          equals: (filterData as any)[key],
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
  return {
    meta: {
      page: options.page || 1,
      limit,
      total: result.length,
    },
    data: result,
  }
}

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  })
  return result
}

const updateAdminToDB = async (id: string, payload: Partial<Admin>) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  })
  if (!existingAdmin) {
    throw new ApiError(404, "Admin not found")
  }
  const result = await prisma.admin.update({
    where: { id },
    data: payload,
  })
  return result
}

const deleteAdminFromDB = async (id: string) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id },
  })
  if (!existingAdmin) {
    throw new ApiError(404, "Admin not found")
  }
  const result = await prisma.$transaction(async (tx) => {
    const result = await tx.admin.delete({
      where: { id },
    })

    await tx.user.delete({
      where: {
        email: existingAdmin.email,
      },
    })

    return result
  })

  return result
}

const softDeleteAdminFromDB = async (id: string) => {
  const existingAdmin = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  })
  if (!existingAdmin) {
    throw new ApiError(404, "Admin not found")
  }
  const result = await prisma.$transaction(async (tx) => {
    const result = await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    })

    await tx.user.update({
      where: {
        email: existingAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    })

    return result
  })

  return result
}

export const AdminService = {
  getAllAdmins,
  getByIdFromDB,
  updateAdminToDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
}
