import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null
      }
      
      const email = credentials.email as string;
      const password = credentials.password as string;
      
      const userRes = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .execute()

      const user = userRes[0]
      if(!user || !user.passwordHash) return null

      const isValid = await compare(password, user.passwordHash)
      if(!isValid) return null

      return {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  })],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false
      
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .execute()

      if(existingUser.length === 0) {
        await db.insert(users).values({
          id: globalThis.crypto.randomUUID(),
          name: user.name || "Anonymous",
          email: user.email,
          profileImage: user.image || null,
        })
      }
      return true
    },

    async jwt({ token, account }) {
      if(account && token.email) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.email, token.email))
          .execute()

        if(dbUser.length > 0) {
          token.sub = dbUser[0].id
        }
      }
      return token
    },

    async session({ session, token }) {
      if(session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    }
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt"
  }
})
