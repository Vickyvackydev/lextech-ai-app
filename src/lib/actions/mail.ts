import {Resend} from 'resend'


const resend = new Resend(process.env.RESEND_API_KEY)   
export const sendVerificationEmail = async (email: string, token: string) => {

    const origin = process.env.NEXTAUTH_URL
    
    const confirmLink = `${origin}/new-verification?token=${token}`
    const data = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Verify your email address',
        html: `<p>Please confirm your email address by clicking on this link: <a href="${confirmLink}">${confirmLink}</a></p>`
    })
}


//send password reset link
export const sendPasswordResetLink = async (email: string, token: string) => {
    const origin = process.env.NEXTAUTH_URL
    const resetLink = `${origin}/create-new-password?token=${token}`
    const data = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset your password',
        html: `<p>Please reset your password by clicking on this link: <a href="${resetLink}">${resetLink}</a></p>`
    })
}