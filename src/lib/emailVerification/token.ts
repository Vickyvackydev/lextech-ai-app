'use server'
import prisma from "@/utils/connect";
import { v4 as uuidv4 } from 'uuid';
import { getVerificationTokenByEmail } from "./verification-token";
import { getPasswordResetTokenByEmail } from "../passwordReset/password-reset-token";




export async function generatePasswordVerificationToken(email: string) {

    const token = uuidv4()
    const expire = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email)

     // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires: expire
        }
    })

    return passwordResetToken
    });

    return result; // Return the created token
}





export async function generateVerificationToken(email: string) {
    const token = uuidv4(); // Generate a new token
    const expire = new Date(new Date().getTime() + 3600 * 1000); // Token expiration in 1 hour

    const existingToken = await getVerificationTokenByEmail(email); // Check if a token already exists

    // Start a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
        // If a token already exists for this email, delete it
        if (existingToken) {
            await prisma.verificationToken.delete({
                where: {
                    id: existingToken.id, // Deleting by unique ID
                },
            });
        }

        // Create a new verification token
        const verificationToken = await prisma.verificationToken.create({
            data: {
                email,
                token,
                expires: expire,
            },
        });

        return verificationToken;
    });

    return result; // Return the created token
}
