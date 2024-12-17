"use server"

import * as z from "zod";
import { NewPasswordSchema } from "@/lib/schemas";
import { getPasswordResetTokenByToken } from "../passwordReset/password-reset-token";
import { getUserByEmail } from "./user";
import { hash } from "bcrypt-ts";
import prisma from "@/utils/connect";

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    try {
        if (!token) {
            return { error: "Missing token" };
        }

        const validatedFields = NewPasswordSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Invalid fields" };
        }

        const { password } = validatedFields.data;
        const existingToken = await getPasswordResetTokenByToken(token);

        if (!existingToken) {
            return { error: "Invalid token" };
        }
        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) {
            return { error: "Token has expired" };
        }

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) {
            return { error: "User does not exist" };
        }

        const hashedPassword = await hash(password, 10);

        await prisma.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                password: hashedPassword
            }
        });

        await prisma.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        });

        return { success: "Password reset successful!" };
    } catch (error) {
        console.error(error);
        return { error: "Something went wrong!" };
    }
};
