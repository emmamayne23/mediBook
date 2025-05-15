import { db } from "@/db/drizzle";
import { doctorProfiles, users, specialties } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { FaUserMd, FaSearch, FaStar, FaRegCalendarAlt } from "react-icons/fa";
import { IoFilter } from "react-icons/io5";

export default async function DoctorsPage() {
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
    .leftJoin(users, eq(doctorProfiles.userId, users.id))
    .leftJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <FaUserMd className="text-4xl" />
            Our Medical Specialists
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Connect with our team of experienced healthcare professionals
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name or specialty..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
              <IoFilter />
              Filters
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <FaUserMd />
            {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'} Available
          </h2>

          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
                >
                  {/* Doctor Image */}
                  <div className="relative h-60 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                    <Image
                      src={doctor.img || "/default-doctor.jpg"}
                      alt={`Dr. ${doctor.name}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {doctor.yearsExperience}+ years
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                      {doctor.specialty}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {doctor.qualifications}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-yellow-400 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < 4 ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"} />
                      ))}
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">(24)</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link 
                        href={`/doctor/${doctor.id}`}
                        className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                      >
                        View Profile
                      </Link>
                      <Link
                        href={`/appointments/book/${doctor.id}`}
                        className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors duration-300"
                      >
                        <FaRegCalendarAlt />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md">
              <FaUserMd className="text-5xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No doctors available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                We couldn&apos;t find any doctors matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}