'use server'
import * as z from "zod"
import { hash } from "bcrypt-ts"
import prisma from "@/utils/connect"

import { RegisterSchema } from "@/lib/schemas"
import { getUserByEmail } from "./user"
import { generateVerificationToken } from "../emailVerification/token"
import { sendVerificationEmail } from "./mail"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid fields"};
    }


    const {email, password, firstName, lastName} = validatedFields.data

    const hashedPassword = await hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return {error: "User already exists"}
    }


    await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            firstName,
            lastName,
            name: `${firstName} ${lastName}`
        }
    })

    //TODO: send verification email


    try {
        const verifictaionToken = await generateVerificationToken(email)    

        await sendVerificationEmail(verifictaionToken.email, verifictaionToken.token)

        return {success: "Confirmation email sent!"}
    } catch (error) {
        console.log(error)
        return {error: "Error sending verification email"}
    }

}