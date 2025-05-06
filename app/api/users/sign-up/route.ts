import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { hash } from "bcryptjs"

export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
        return NextResponse.json({ message: "Missing fields" }, { status: 400 });
      }

    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email))
        if(existingUser.length > 0) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 })
        }

        const hashedPassword = await hash(password, 10)
        await db.insert(users).values({id: crypto.randomUUID(), name, email, passwordHash: hashedPassword })

        return NextResponse.json({ message: "User created successfully" })
        
    } catch (error) {
        console.error("Could not create user", error)
    }
}