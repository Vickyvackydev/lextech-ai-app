'use server'
import * as z from "zod"

import { LoginSchema } from "@/lib/schemas"
import {signIn} from "@/app/api/auth/[...nextauth]/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routeStrategy"
import { AuthError } from "next-auth"
import { generateVerificationToken } from "../emailVerification/token"
import { getUserByEmail } from "./user"
import { sendVerificationEmail } from "./mail"


export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {error: "Invalid fields"};
    }


    const {email, password} = validatedFields.data
    const existingUser = await getUserByEmail(email)

    if (!existingUser || !existingUser.password || !existingUser.email) {
        return {error: "User does not exist"}

    }

    /* if (!existingUser.emailVerified) {
        try {
            const verificationToken = await generateVerificationToken(existingUser.email)
            await sendVerificationEmail(verificationToken.email, verificationToken.token)

            return {error: "Please verify your email!!! Check your email for a verification link", verificationToken}
        } catch (error) {
            console.log(error)
            return {error: "Something went wrong while sending verification email!"}
        }
    } */

    try {
        const user = await signIn("credentials", {
            redirectTo: DEFAULT_LOGIN_REDIRECT ,
            email,
            password
        })
        return {success: 'Successfully logged in!'}
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {error: "Invalid credentials!"}
                default:
                    return {error: "Something went wrong!"}
            }
        }
        throw error;
    }

}