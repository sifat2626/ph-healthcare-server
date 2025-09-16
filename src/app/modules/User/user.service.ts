import bcrypt from "bcrypt"
import { prisma } from "../../../shared/prisma"
import { UserRole } from "../../../../generated/prisma"
import config from "../../../config"
import { fileUploader } from "../../utils/fileUploader"

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

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
}
