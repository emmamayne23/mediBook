import { db } from "@/db/drizzle"
import { doctorProfiles, users, specialties } from "@/db/schema"
import { eq } from "drizzle-orm"
import Image from "next/image"
import Link from "next/link"

export default async function DoctorsPage() {
    const doctors = await db
      .select({ id: doctorProfiles.id, name: users.name, specialty: specialties.specialty, img: doctorProfiles.imageUrl })
      .from(doctorProfiles)
      .leftJoin(users, eq(doctorProfiles.userId, users.id,))
      .leftJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id))
    return (
        <div>
            <h1>Doctors Page</h1>
            <div>
                <h2>All Doctors</h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  border">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="border-2 p-4 rounded-lg space-y-3 w-10/12 text-center mx-auto">
                            <Image 
                              src={doctor.img || ""} 
                              alt="doctor image" 
                              width={100} 
                              height={100} 
                              className="w-full object-cover" />
                            <h3>{doctor.name}</h3>
                            <p>{doctor.specialty}</p>

                            <Link href={`/doctor/${doctor.id}`} className="border-2 p-2 rounded-lg">
                                <button className="cursor-pointer">View Profile</button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}