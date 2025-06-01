import { db } from '@/db/drizzle';
import { appointments, doctorProfiles, users, timeAvailabilitySlots, specialties } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const appointment = await db
          .select({
            appointmentId: appointments.id,
            status: appointments.status,
            doctorName: users.name,
            doctorId: doctorProfiles.id,
            doctorProfileImage: doctorProfiles.imageUrl,
            appointmentDate: timeAvailabilitySlots.date,
            appointmentTime: timeAvailabilitySlots.startTime,
            reason: appointments.reason,
            specialty: specialties.specialty,
          })
          .from(appointments)
          .leftJoin(doctorProfiles, eq(doctorProfiles.id, appointments.doctorId))
          .leftJoin(users, eq(users.id, doctorProfiles.userId))
          .leftJoin(timeAvailabilitySlots, eq(timeAvailabilitySlots.id, appointments.slotId))
          .leftJoin(specialties, eq(specialties.id, doctorProfiles.specialtyId))
          .where(eq(appointments.id, params.id))
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