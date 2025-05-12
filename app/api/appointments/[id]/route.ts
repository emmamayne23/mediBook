import { db } from '@/db/drizzle';
import { appointments } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const appointment = await db.select().from(appointments).where(eq(appointments.id, params.id))
        return appointment[0] ? NextResponse.json(appointment[0]) : NextResponse.json({ message: 'Appointment record not found' }, { status: 404 })
    } catch (error) {
        console.error('Error fetching appointment:', error);
        return NextResponse.json(
            { error: 'Failed to fetch appointment' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json();
  const updated = await db.update(appointments).set(data).where(eq(appointments.id, params.id)).returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await db.delete(appointments).where(eq(appointments.id, params.id));
  return NextResponse.json({ success: true });
}