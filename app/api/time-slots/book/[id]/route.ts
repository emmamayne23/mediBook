import { db } from "@/db/drizzle";
import { timeAvailabilitySlots, doctorProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const timebook = await db
      .select({
        id: timeAvailabilitySlots.id,
        date: timeAvailabilitySlots.date,
        startTime: timeAvailabilitySlots.startTime,
        endTime: timeAvailabilitySlots.endTime,
        doctorId: timeAvailabilitySlots.doctorId,
        doctorName: users.name,
        doctorImage: doctorProfiles.imageUrl,
        doctorQualifications: doctorProfiles.qualifications,
        doctorSpecialty: doctorProfiles.specialtyId,
      })
      .from(timeAvailabilitySlots)
      .where(eq(timeAvailabilitySlots.id, params.id))
      .leftJoin(doctorProfiles, eq(timeAvailabilitySlots.doctorId, doctorProfiles.id))
      .leftJoin(users, eq(doctorProfiles.userId, users.id))
    
    return NextResponse.json(timebook[0])
}