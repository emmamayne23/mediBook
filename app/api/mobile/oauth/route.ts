import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const { email, name, image } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  let user = await db.select().from(users).where(eq(users.email, email)).execute()

  if (user.length === 0) {
    // First-time Google login, insert user
    const newUser = {
      id: crypto.randomUUID(),
      name: name || "Google User",
      email,
      profileImage: image || null,
      role: "patient",
    }

    await db.insert(users).values(newUser)
    user = [newUser]
  }

  // Sign a JWT for the mobile app
  const token = jwt.sign(
    {
      sub: user[0].id,
      email: user[0].email,
      role: user[0].role,
    },
    process.env.AUTH_SECRET!,
    { expiresIn: "7d" }
  )

  return NextResponse.json({ token })
}
