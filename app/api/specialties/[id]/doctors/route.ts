import { db } from "@/db/drizzle";
import { specialties, doctorProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const doctors = await db
          .select({ 
              id: doctorProfiles.id, 
              name: users.name, 
              specialty: specialties.specialty, 
              img: doctorProfiles.imageUrl,
              yearsExperience: doctorProfiles.yearsExperience,
              qualifications: doctorProfiles.qualifications
            })
          .from(doctorProfiles)
          .where(eq(doctorProfiles.specialtyId, params.id))
          .leftJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id))
          .leftJoin(users, eq(doctorProfiles.userId, users.id))
          return NextResponse.json(doctors)
    } catch (error) {
        console.error("Could not get doctors", error)
        return NextResponse.json({ message:  "Could not get doctors" }, { status: 500 })
    }
}