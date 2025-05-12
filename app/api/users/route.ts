import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth()
    if(!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // if(!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    try {
        const allUsers = await db.select().from(users)
        return NextResponse.json({ users: allUsers })
    } catch (error) {
        console.error("Could not get users", error)
        return NextResponse.json({ error: "Could not fetch users" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const newUser = await db.insert(users).values(body).returning()
        return NextResponse.json(newUser[0], { status: 201 })
    } catch (error) {
        console.error("Could not create user", error)
        return NextResponse.json({ error: "Could not create user" }, { status: 500 })
    }
}