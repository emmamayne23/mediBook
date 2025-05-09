import { db } from "@/db/drizzle"
import { doctorProfiles, users, specialties } from "@/db/schema"
import { eq } from "drizzle-orm"
import Image from "next/image"

interface ParamsProps {
    params: { id: string }
}

export default async function DoctorDetailsPage({ params }: ParamsProps) {
    const { id } =  await params

    const [doctor] = await db
      .select()
      .from(doctorProfiles)
      .where(eq(doctorProfiles.id, id))
      .innerJoin(users, eq(doctorProfiles.userId, users.id))
      .innerJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id))

      if (!doctor) return <p>Doctor not found.</p>;
    return (
        <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{doctor.users.name}</h1>
      <p className="text-sm text-gray-500 mb-2">{doctor.specialties.specialty}</p>
      <p className="mb-2">{doctor.doctor_profiles.bio}</p>
      <p className="mb-2">{doctor.doctor_profiles.qualifications}</p>
      <Image
        width={100}
        height={100}
        src={doctor.doctor_profiles.imageUrl || "/default-doctor.jpg"}
        alt="Doctor"
        className="rounded w-40 h-40 object-cover mt-4"
      />
    </div>
    )
}