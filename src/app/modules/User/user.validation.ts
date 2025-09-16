import { email, z } from "zod"
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

export const userValidation = {
  createAdmin,
}
