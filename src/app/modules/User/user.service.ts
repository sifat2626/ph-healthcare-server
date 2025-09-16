import bcrypt from "bcrypt"
import { prisma } from "../../../shared/prisma"
import { Prisma, UserRole } from "../../../../generated/prisma"
import config from "../../../config"
import { fileUploader } from "../../utils/fileUploader"
import { calculatePagination } from "../../../shared/calculatePagination"
import { userSearchableFields } from "./user.constant"

const createAdmin = async (req: any) => {
  console.log("req.body", req.body)
  const data = req.body
  const file = req.file

  if (file) {
    const uploadedImageUrl = await fileUploader.uploadToCloudinary(file)
    data.admin.profilePicture = uploadedImageUrl
  }

  const hashedPassword = await bcrypt.hash(
    data.password,
    config.bcrypt.saltRounds
  )
  const userData = {
    email: data.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  }

  const result = await prisma.$transaction(async (tx: any) => {
    const createdUserData = await tx.user.create({
      data: userData,
    })

    const createdAdminData = await tx.admin.create({
      data: data.admin,
    })

    return {
      user: createdUserData,
      admin: createdAdminData,
    }
  })

  return result
}

const createDoctor = async (req: any) => {
  console.log("req.body", req.body)
  const data = req.body
  const file = req.file
  if (file) {
    const uploadedImageUrl = await fileUploader.uploadToCloudinary(file)
    data.doctor.profilePhoto = uploadedImageUrl
  }
  const hashedPassword = await bcrypt.hash(
    data.password,
    config.bcrypt.saltRounds
  )
  const userData = {
    email: data.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  }
  const result = await prisma.$transaction(async (tx: any) => {
    const createdUserData = await tx.user.create({
      data: userData,
    })
    const createdDoctorData = await tx.doctor.create({
      data: {
        ...data.doctor,
      },
    })
    return {
      user: createdUserData,
      doctor: createdDoctorData,
    }
  })
  return result
}

const createPatient = async (req: any) => {
  console.log("req.body", req.body)
  const data = req.body
  const file = req.file
  if (file) {
    const uploadedImageUrl = await fileUploader.uploadToCloudinary(file)
    data.patient.profilePhoto = uploadedImageUrl
  }
  const hashedPassword = await bcrypt.hash(
    data.password,
    config.bcrypt.saltRounds
  )
  const userData = {
    email: data.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  }
  const result = await prisma.$transaction(async (tx: any) => {
    const createdUserData = await tx.user.create({
      data: userData,
    })
    const createdPatientData = await tx.patient.create({
      data: {
        ...data.patient,
      },
    })
    return {
      user: createdUserData,
      patient: createdPatientData,
    }
  })
  return result
}

const getAllUsers = async (params: any, options: any) => {
  const { limit, skip, orderBy } = calculatePagination(options)
  const { searchTerm, ...filterData } = params
  const andConditions: Prisma.UserWhereInput[] = []

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
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

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {}
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy,
    select: {
      id: true,
      email: true,
      role: true,
      needsPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      doctor: true,
      admin: true,
      patient: true,
    },
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

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
}
