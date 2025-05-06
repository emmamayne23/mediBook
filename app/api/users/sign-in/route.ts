import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { compare } from "bcryptjs";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()
    if (!email || !password) {
        return NextResponse.json({ message: "Missing fields" }, { status: 400 });
      }
    try {
        const userRes = await db.select().from(users).where(eq(users.email, email))
        const user = userRes[0]

        if(!user || !user.passwordHash) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        const isValid = await compare(password, user.passwordHash)
        if(!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
        }

        return NextResponse.json({ message: "Signed in successfully", user })
    } catch (error) {
        console.error("Could not sign in", error)
    }
}