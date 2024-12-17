import NextAuth, { User } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/utils/connect"
import authConfig from "./auth.config"
import log from "logging-service"
import { getUserById } from "@/lib/actions/user"
 

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  events: {
    async linkAccount({user}) {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerified: new Date()
        }
      })
      
    },
  },
  callbacks: {
  async signIn({ user, account, profile, email, credentials }) {
    //Allow OAuth users to sign in
    if (account?.provider !== "credentials") return true

    if (!user.id) {
      // Handle the case where user.id is undefined
      // For example, you could return an error or throw an exception
      return false;
    }
    const existingUser = await getUserById(user.id);
    /* if (!existingUser || !existingUser.emailVerified) {
      return false;
    }  */
  
    return true;
  },
    async session({ session, token }) {
      console.log({sessionToken: token, session})

      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token}) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token
      console.log({token})
      return token
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  
})












///THIS IS HOW YOU EXTEND A SESSION
/* 
import NextAuth, { User, DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session{
    user: {
      role: "ADMIN" | "USER"

    } & DefaultSession['user']
  }
}

session
 if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER"
      }

jwt
 token.role = existingUser.role */