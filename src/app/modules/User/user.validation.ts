import { email, z } from "zod"
import { Gender } from "../../../../generated/prisma"
const createAdmin = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    admin: z.object({
      name: z.string().nonempty("Name is required"),
      email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
      contactNumber: z.string().nonempty("Contact number is required"),
    }),
  }),
})

const createDoctor = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    doctor: z.object({
      name: z.string().nonempty("Name is required"),
      email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
      profilePhoto: z.string().optional(),
      contactNumber: z.string().nonempty("Contact number is required"),
      address: z.string().optional(),
      registrationNumber: z
        .string()
        .nonempty("Registration number is required"),
      experienceYears: z
        .number()
        .min(0, "Experience years cannot be negative")
        .optional(),
      gender: z.enum([Gender.MALE, Gender.FEMALE]),
      appointmentFee: z.number().min(0, "Appointment fee cannot be negative"),
      qualifications: z.string().nonempty("Qualifications are required"),
      currentWorkplace: z.string().nonempty("Current workplace is required"),
      designation: z.string().nonempty("Designation is required"),
    }),
  }),
})

const createPatient = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    patient: z.object({
      name: z.string().nonempty("Name is required"),
      email: z
        .string()
        .email("Invalid email address")
        .nonempty("Email is required"),
      profilePhoto: z.string().optional(),
      contactNumber: z.string().nonempty("Contact number is required"),
      address: z.string().optional(),
    }),
  }),
})

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
}
