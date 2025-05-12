import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: {  id:string } }) {
    try {
        const user = await db.select().from(users).where(eq(users.id, params.id))
        if(!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        return NextResponse.json({ user: user[0] })
    } catch (error) {
        console.error("Could not get user", error)
        return NextResponse.json({ error: "Could not fetch user" }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        const updatedUser = await db.update(users).set(body).where(eq(users.id, params.id))
        return NextResponse.json({ user: updatedUser })
    } catch (error) {
        console.error("Could not update user", error)
        return NextResponse.json({ error: "Could not update user" }, { status: 500 })
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    try {
        await db.delete(users).where(eq(users.id, params.id))
    } catch (error) {
        console.error("Could not delete user", error)
        return NextResponse.json({ error: "Could not delete user" }, { status: 500 })
    }
}