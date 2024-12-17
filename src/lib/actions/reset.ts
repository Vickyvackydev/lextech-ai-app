'use server'

import { ResetSchema } from "@/lib/schemas"
import * as z from "zod"
import { getUserByEmail } from "./user"
import { generatePasswordVerificationToken } from "../emailVerification/token"
import { sendPasswordResetLink } from "./mail"


export const reset = async (data: z.infer<typeof ResetSchema>) => {
   const validatedFields = ResetSchema.safeParse(data);

   if (!validatedFields.success) {
       return {error: "Invalid email!"};
   }


   const {email} = validatedFields.data
   const existingUser = await getUserByEmail(email)

   if (!existingUser) {
       return {error: "Email does not exist!"};
   }

   // Generate reset token and send it to the user's emai
   const passwordResetToken = await generatePasswordVerificationToken(email)

   await sendPasswordResetLink(passwordResetToken.email, passwordResetToken.token)

   return {success: "Check your email for a reset link"}
}

