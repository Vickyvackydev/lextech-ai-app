import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "@/lib/actions/user"
import { LoginSchema } from "@/lib/schemas" 
import { hash, compare } from "bcrypt-ts";
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
            const { email, password } = validatedFields.data

            const user = await getUserByEmail(email)

            if (!user || !user.password) return null

            const isValid = await compare(password, user.password)


            if (isValid) return user
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig
