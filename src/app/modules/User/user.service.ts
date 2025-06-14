import { Doctor, PrismaClient, UserRole } from "../../../../generated/prisma"
import * as bcrypt from "bcrypt"
import prisma from "../../../shared/prisma"

const createAdmin = async (payload: any) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10)
  const userData = {
    email: payload.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  }

  const result = await prisma.$transaction(async (prisma) => {
    const createdUserData = await prisma.user.create({
      data: userData,
    })

    const createdAdminData = await prisma.admin.create({
      data: payload.admin,
    })

    return createdAdminData
  })

  return result
}

const createDoctor = async (payload: any) => {
  const { password, email, ...doctorData } = payload
  const hashedPassword = await bcrypt.hash(password, 10)
  const userData = {
    email: email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  }

  const result = await prisma.$transaction(async (prisma) => {
    const createdUserData = await prisma.user.create({
      data: userData,
    })

    const createdDoctorData = await prisma.doctor.create({
      data: {
        ...doctorData,
        user: {
          connect: {
            email: createdUserData.email,
          },
        },
      },
    })

    return createdDoctorData
  })

  return result
}

const createPatient = async (payload: any) => {
  const { password, email, ...patientData } = payload
  const hashedPassword = await bcrypt.hash(password, 10)
  const userData = {
    email: email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  }

  const result = await prisma.$transaction(async (prisma) => {
    const createdUserData = await prisma.user.create({
      data: userData,
    })

    const createdPatientData = await prisma.patient.create({
      data: {
        ...patientData,
        user: {
          connect: {
            email: createdUserData.email,
          },
        },
      },
    })

    return createdPatientData
  })

  return result
}

export const UserService = {
  createAdmin,
  createDoctor,
  createPatient,
}
