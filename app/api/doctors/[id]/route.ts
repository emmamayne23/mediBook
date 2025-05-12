import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { doctorProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const doctor = await db.select().from(doctorProfiles).where(eq(doctorProfiles.id, params.id))
        return doctor[0] ? NextResponse.json(doctor[0]) : NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    } catch (error) {
        console.error("Could not get doctor profile", error)
        return NextResponse.json({ error: "Could not fetch doctor profile" }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updated = await db.update(doctorProfiles).set(data).where(eq(doctorProfiles.id, params.id)).returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await db.delete(doctorProfiles).where(eq(doctorProfiles.id, params.id));
  return NextResponse.json({ success: true });
}