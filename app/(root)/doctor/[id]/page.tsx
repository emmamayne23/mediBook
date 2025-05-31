import { db } from "@/db/drizzle";
import { doctorProfiles, users, specialties, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import {
  FaUserMd,
  FaRegCalendarAlt,
  FaAward,
  FaClinicMedical,
  FaStar,
  FaComment,
} from "react-icons/fa";
import Link from "next/link";

interface ParamsProps {
  params: { id: string };
}

export default async function DoctorDetailsPage({ params }: ParamsProps) {
  const { id } = await params;

  const [doctor] = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.id, id))
    .innerJoin(users, eq(doctorProfiles.userId, users.id))
    .innerJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id));

  const comments = await db
    .select()
    .from(reviews)
    .where(eq(reviews.doctorId, id))
    .leftJoin(users, eq(reviews.patientId, users.id));

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md">
          <FaUserMd className="text-5xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Doctor Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The requested doctor profile could not be found.
          </p>
          <Link
            href="/specialties"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Browse Specialists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Doctor Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="relative">
              <Image
                width={160}
                height={160}
                src={doctor.doctor_profiles.imageUrl || "/default-doctor.jpg"}
                alt={`Dr. ${doctor.users.name}`}
                className="rounded-full border-4 border-white dark:border-gray-700 shadow-lg w-40 h-40 object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2 shadow-md">
                <FaUserMd className="text-xl" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                  {doctor.specialties.specialty}
                </span>
                <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <FaStar className="text-yellow-500" />
                  <span>4.9 (120 reviews)</span>
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Dr. {doctor.users.name}
              </h1>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                {doctor.doctor_profiles.qualifications}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <FaAward className="text-yellow-500" />
                  <span>
                    {doctor.doctor_profiles.yearsExperience}+ years experience
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClinicMedical className="text-blue-500" />
                  <span>Available Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                About Dr. {doctor.users.name}
              </h2>
              <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
                <p className="mb-4">{doctor.doctor_profiles.bio}</p>

                <h3 className="text-lg font-medium text-gray-800 dark:text-white mt-6 mb-3">
                  Education
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Medical Degree from Harvard Medical School</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Residency at Johns Hopkins Hospital</span>
                  </li>
                </ul>

                <h3 className="text-lg font-medium text-gray-800 dark:text-white mt-6 mb-3">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialties.specialty.split(",").map((spec, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full"
                    >
                      {spec.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Book Appointment
                </h3>
                <Link
                  href={`/appointments/book/${id}`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-300"
                >
                  <FaRegCalendarAlt />
                  Schedule Now
                </Link>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Contact Information
                </h3>
                <div className="space-y-3 text-gray-600 dark:text-gray-300">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {doctor.users.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> (555) 123-456
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> 123 Medical
                    Center Dr, Suite 45
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Availability
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p className="flex justify-between">
                    <span>Mon - Fri</span>
                    <span className="font-medium">9:00 AM - 5:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium">10:00 AM - 3:00 PM</span>
                  </p>
                  <p className="flex justify-between text-red-500">
                    <span>Sunday</span>
                    <span className="font-medium">Closed</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reviews Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mt-10">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-5">
                <FaComment className="text-3xl text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Patients feedback will appear here once they submit reviews
                after appointments.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Recent Reviews
                </h2>
              </div>
              {comments.map((review) => (
                <div
                  key={review.reviews.id}
                  className="p-5 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {review.users?.profileImage ? (
                      <Image
                        src={review.users.profileImage}
                        alt={review.users.name || ""}
                        width={52}
                        height={52}
                        className="rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-600 dark:text-blue-300 font-medium text-lg">
                        {review.users?.name?.charAt(0) || "P"}
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {review.users?.name || "Anonymous Patient"}
                        </h3>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(
                            review.reviews.createdAt
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </div>

                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-lg mx-0.5 ${
                              i < review.reviews.rating
                                ? "text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {review.reviews.rating.toFixed(1)}/5
                        </span>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300">
                        {review.reviews.comment ||
                          "No detailed feedback provided."}
                      </p>

                      {review.reviews.response && (
                        <div className="mt-4 pl-4 border-l-4 border-blue-200 dark:border-blue-800">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Response:
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">
                            {review.reviews.response}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
