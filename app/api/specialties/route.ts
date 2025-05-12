import { db } from "@/db/drizzle";
import { specialties } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const allSpecialties = await db.select().from(specialties)
        return NextResponse.json({ specialties: allSpecialties })
    } catch (error) {
        console.error("Could not get specialties", error)
        return NextResponse.json({ error: "Could not fetch specialties" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const newSpecialty = await db.insert(specialties).values(body).returning()
        return NextResponse.json(newSpecialty[0], { status: 201 })
    } catch (error) {
        console.error("Could not create specialty", error)
        return NextResponse.json({ error: "Could not create specialty" }, { status: 500 })
    }
}