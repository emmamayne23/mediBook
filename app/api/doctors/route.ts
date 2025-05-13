import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { doctorProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const allDoctors = await db.select({ id: doctorProfiles.id, name: users.name }).from(doctorProfiles).innerJoin(users, eq(users.id, doctorProfiles.userId))
        return NextResponse.json(allDoctors)
    } catch (error) {
        console.error("Could not get doctor profiles", error)
        return NextResponse.json({ error: "Could not fetch doctor profiles" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const newDoctor = await db.insert(doctorProfiles).values(body).returning()
        return NextResponse.json(newDoctor[0], { status: 201 })
    } catch (error) {
        console.error("Could not create doctor profile", error)
        return NextResponse.json({ error: "Could not create doctor profile" }, { status: 500 })
    }
}