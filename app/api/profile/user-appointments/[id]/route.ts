import { db } from "@/db/drizzle";
import { users, doctorProfiles, specialties, timeAvailabilitySlots, appointments } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const userappointments = await db
          .select({
            appointmentId: appointments.id,
            status: appointments.status,
            doctorName: users.name,
            doctorProfileImage: doctorProfiles.imageUrl,
            appointmentDate: timeAvailabilitySlots.date,
            appointmentTime: timeAvailabilitySlots.startTime,
            specialty: specialties.specialty
          })
          .from(appointments)
          .leftJoin(doctorProfiles, eq(doctorProfiles.id, appointments.doctorId))
          .leftJoin(users, eq(doctorProfiles.userId, users.id))
          .leftJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id))
          .leftJoin(timeAvailabilitySlots, eq(timeAvailabilitySlots.id, appointments.slotId))
          .where(eq(appointments.patientId, params.id))
          .orderBy(desc(appointments.createdAt))

        return NextResponse.json(userappointments)
    } catch (error) {
        console.error("Could not fetch appointments", error)
        return NextResponse.json({ error: "Can't fetch appointments" }, { status: 500 })
    }
}