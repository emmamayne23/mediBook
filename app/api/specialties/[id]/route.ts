import { db } from "@/db/drizzle";
import { specialties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: {  id: string } }) {
    try {
        const specialty = await db.select().from(specialties).where(eq(specialties.id, params.id))
        return NextResponse.json(specialty[0])
    } catch (error) {
        console.error("Could not get specialty", error)
        return NextResponse.json({ error: "Could not get specialty" }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updated = await db.update(specialties).set(data).where(eq(specialties.id, params.id)).returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await db.delete(specialties).where(eq(specialties.id, params.id));
  return NextResponse.json({ success: true });
}