// app/api/mobile/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { compare } from "bcryptjs"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
  }

  const userRes = await db.select().from(users).where(eq(users.email, email)).execute()
  const user = userRes[0]

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "User not found" }, { status: 401 })
  }

  const isValid = await compare(password, user.passwordHash)
  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.AUTH_SECRET!,
    { expiresIn: "7d" }
  )

  return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } })
}
