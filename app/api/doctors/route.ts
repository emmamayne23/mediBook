import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { doctorProfiles } from "@/db/schema";

export async function GET() {
    try {
        const allDoctors = await db.select().from(doctorProfiles)
        return NextResponse.json({ doctors: allDoctors })
    } catch (error) {
        console.error("Could not get doctor profiles", error)
        return NextResponse.json({ error: "Could not fetch doctor profiles" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const newDoctor = await db.insert(doctorProfiles).values(body).returning()
        return NextResponse.json({ doctor: newDoctor[0] }, { status: 201 })
    } catch (error) {
        console.error("Could not create doctor profile", error)
        return NextResponse.json({ error: "Could not create doctor profile" }, { status: 500 })
    }
}