'use server'

import prisma from "@/utils/connect"

//get password reset token by token
export const getPasswordResetTokenByToken = async (token: string) => {
    try{
        const passwordResetToken = await prisma.passwordResetToken.findUnique({
            where: {
                token
            }
        })
        return passwordResetToken
    } catch (error) {
        return null
    }

}




//get password reset token by email

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await prisma.passwordResetToken.findFirst({
            where: {
                email
            }
        })
        return passwordResetToken
    } catch (error) {
        return null
    }
}