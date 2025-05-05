import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email || ""))
        .execute()

      if(existingUser.length === 0) {
        await db.insert(users).values({
          id: globalThis.crypto.randomUUID(),
          name: user.name || "Anonymous",
          email: user.email || "",
          profileImage: user.image || null,
        })
      }
      return true
    },

    async jwt({ token, account, profile }) {
      if(account && profile?.email) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.email, profile.email || ""))
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
  }
})