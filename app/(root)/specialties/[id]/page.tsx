import { db } from "@/db/drizzle";
import { specialties, users, doctorProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ParamsProps {
  params: { id: string };
}

export default async function SpecialtyDoctorsPage({ params }: ParamsProps) {
  const { id } = await params;

  // get the specialty info
  const [specialty] = await db
    .select()
    .from(specialties)
    .where(eq(specialties.id, id));

  if (!specialty) {
    return notFound();
  }

  // getting the doctors under this specialty
  const doctors = await db
    .select({
      id: doctorProfiles.id,
      bio: doctorProfiles.bio,
      qualifications: doctorProfiles.qualifications,
      yearsExperience: doctorProfiles.yearsExperience,
      imageUrl: doctorProfiles.imageUrl,
      user: {
        name: users.name,
        email: users.email,
      },
    })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.specialtyId, id))
    .innerJoin(users, eq(doctorProfiles.userId, users.id));
  return (
    <section className="py-25">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-4">
        {specialty.specialty}
      </h1>
      <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
        {specialty.description}
      </p>

      {doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5">
          {doctors.map((doc) => (
            <div key={doc.id} className="p-6 border rounded shadow">
              <span className="border border-green-600 px-3 py-1.5 text-xs rounded-full">Open Office</span>
              <Image
                width={100}
                height={100}
                src={doc.imageUrl ?? "/default-doctor.jpg"}
                alt="Doctor"
                className="w-32 h-32 object-cover rounded-full mb-4 mx-auto"
              />
              <h2 className="text-xl font-semibold text-center">
                {doc.user.name}
              </h2>
              <p className="text-sm text-gray-500 text-center">
                {doc.qualifications}
              </p>
              <p className="text-center mt-2 text-sm">{doc.bio}</p>
              <div className="flex gap-2 mt-2 text-sm text-center">
                <Link href={`/doctor/${doc.id}`} className="bg-green-500 px-3 py-1.5 w-full rounded-lg">View Details</Link>
                <Link href={`/appointments/book/${doc.id}`} className="bg-blue-500 px-3 py-1.5 w-full rounded-lg">Book Appointment</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No doctors found under this specialty yet.
        </p>
      )}
    </section>
  );
}
