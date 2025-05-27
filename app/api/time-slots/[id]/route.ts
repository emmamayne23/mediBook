import { db } from '@/db/drizzle';
import { timeAvailabilitySlots } from '@/db/schema';
import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const record = await db
    .select()
    .from(timeAvailabilitySlots)
    .where(and
      (eq(timeAvailabilitySlots.doctorId, params.id), 
       eq(timeAvailabilitySlots.isBooked, false)
      ))
  return record ? NextResponse.json(record) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { isBooked } = await req.json()
  if(typeof isBooked !== "boolean") {
    return NextResponse.json({ error: "Invalid isBooked value" }, { status: 400 })
  }
  await db.update(timeAvailabilitySlots).set({ isBooked: true }).where(eq(timeAvailabilitySlots.id, params.id))
  return NextResponse.json({ success: true })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await db.delete(timeAvailabilitySlots).where(eq(timeAvailabilitySlots.id, params.id));
  return NextResponse.json({ success: true });
}