import { db } from "@/db/drizzle";
import { specialties, users, doctorProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaUserMd, FaRegCalendarAlt, FaAward, FaInfoCircle } from "react-icons/fa";

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
    <section className="py-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Specialty Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {specialty.specialty} Specialists
          </h1>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {specialty.description}
          </p>
        </div>

        {/* Doctors Grid */}
        {doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <div 
                key={doc.id} 
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Doctor Image */}
                <div className="relative h-48 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 flex justify-center items-center">
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Available Today
                    </span>
                  </div>
                  <Image
                    width={120}
                    height={120}
                    src={doc.imageUrl ?? "/default-doctor.jpg"}
                    alt={`Dr. ${doc.user.name}`}
                    className="w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-md"
                  />
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-1">
                    {doc.user.name}
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400 text-center font-medium mb-4">
                    {doc.qualifications}
                  </p>

                  {/* Experience */}
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                    <FaAward className="text-yellow-500" />
                    <span>{doc.yearsExperience}+ years experience</span>
                  </div>

                  {/* Bio Excerpt */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-6">
                    {doc.bio}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <Link 
                      href={`/doctor/${doc.id}`}
                      className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      <FaInfoCircle />
                      View Profile
                    </Link>
                    <Link
                      href={`/appointments/book/${doc.id}`}
                      className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                      <FaRegCalendarAlt />
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md max-w-2xl mx-auto">
            <FaUserMd className="text-5xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No specialists available yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              We don&apos;t have any {specialty.specialty} specialists at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}