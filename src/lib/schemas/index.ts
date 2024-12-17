import * as z from "zod"




export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Minimum 6 characters are required",
    }),
    confirmPassword: z
      .string()
      .min(6, {
        message: "Minimum 6 characters are required",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Path where the error will be displayed
  });






export const LoginSchema = z.object({
    email: z.string().email({
        message: "email is required"
    }),
    password: z.string().min(1, {
        message: "password is required"
    })
})



export const ResetSchema = z.object({
    email: z.string().email({
        message: "email is required"
    }),
})


export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: "Email is required",
    }),
    password: z
      .string()
      .min(6, {
        message: "Minimum 6 characters are required",
      }),
    confirmPassword: z
      .string()
      .min(6, {
        message: "Minimum 6 characters are required",
      }),
    firstName: z.string().min(1, {
      message: "First name is required",
    }),
    lastName: z.string().min(1, {
      message: "Last name is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Where the error will be displayed
  });
