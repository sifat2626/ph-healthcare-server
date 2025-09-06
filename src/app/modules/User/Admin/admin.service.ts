import { Prisma, PrismaClient } from "../../../../../generated/prisma"
const prisma = new PrismaClient()

const getAllAdmins = async (params: any) => {
  const andConditions: Prisma.AdminWhereInput[] = []
  const adminSearchableFields = ["name", "email"]

  // [
  //       {
  //         name: {
  //           contains: params.searchTerm,
  //           mode: "insensitive",
  //         },
  //       },
  //       {
  //         email: {
  //           contains: params.searchTerm,
  //           mode: "insensitive",
  //         },
  //       },
  //     ],

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

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions }
  const result = await prisma.admin.findMany({
    where: whereConditions,
  })
  return result
}

export const AdminService = {
  getAllAdmins,
}
