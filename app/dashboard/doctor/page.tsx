import { db } from "@/db/drizzle";
import {
  users,
  doctorProfiles,
  timeAvailabilitySlots,
  reviews,
  appointments,
  specialties,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import DoctorProfileSection from "../doctor/edit/page";
import {
  FaUserMd,
  FaCalendarAlt,
  FaStar,
  FaClock,
  FaUser,
  FaCalendar,
  FaComment,
  FaArrowRight,
  FaCalendarPlus,
  FaFileMedical,
} from "react-icons/fa";

export default async function DoctorDashboardPage() {
  const session = await auth();
  if (!session || session.user?.role !== "doctor") {
    redirect("/not-found");
  }

  const doctorProfileResult = await db
    .select({ id: doctorProfiles.id })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, session.user.id));

  const doctorProfileId = doctorProfileResult[0].id;


  const doctorProfile = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.id, doctorProfileId))
    .then((res) => res[0]);

  if (!doctorProfile) {
    redirect("/not-found");
  }

  const doctor = await db
    .select()
    .from(users)
    .where(eq(users.id, doctorProfile.userId))
    .then((res) => res[0]);

  const [specialty] = await db
    .select({ specialty: specialties.specialty })
    .from(doctorProfiles)
    .leftJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id))
    .where(eq(doctorProfiles.userId, doctorProfileId));

  // const [timeAvailability] = await db
  //   .select()
  //   .from(timeAvailabilitySlots)
  //   .where(eq(timeAvailabilitySlots.doctorId, id));

  const comments = await db
    .select()
    .from(reviews)
    .leftJoin(users, eq(reviews.patientId, users.id))
    .where(eq(reviews.doctorId, doctorProfileId));

  const allappointments = await db
    .select({
      id: appointments.id,
      status: appointments.status,
      patientName: users.name,
      appointmentDate: timeAvailabilitySlots.date,
      appointmentTime: timeAvailabilitySlots.startTime,
      appointmentEndTime: timeAvailabilitySlots.endTime,
    })
    .from(appointments)
    .leftJoin(doctorProfiles, eq(appointments.doctorId, doctorProfiles.id))
    .leftJoin(users, eq(appointments.patientId, users.id))
    .leftJoin(
      timeAvailabilitySlots,
      eq(appointments.slotId, timeAvailabilitySlots.id)
    )
    .where(eq(appointments.doctorId, doctorProfileId));

  const reviewsWithRatings = await db
    .select({ rating: reviews.rating })
    .from(reviews)
    .where(eq(reviews.doctorId, doctorProfileId));

  let averageRating = "N/A";
  if (reviewsWithRatings.length > 0) {
    const totalRating = reviewsWithRatings.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    averageRating = (totalRating / reviewsWithRatings.length).toFixed(1);
  }

  // console.log(comments);
  // console.log("doctor id: ", doctorProfileId);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm">
              <FaUserMd className="text-2xl text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Doctor Dashboard
              </h1>
              <div className="mt-2 flex items-center gap-3">
                {doctorProfile?.imageUrl && (
                  <Image
                    src={doctorProfile.imageUrl}
                    width={40}
                    height={40}
                    alt="Profile"
                    className="rounded-full border-2 border-white dark:border-gray-700"
                  />
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Dr. {doctor.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {specialty?.specialty}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <StatCard
              icon={<FaCalendarAlt className="text-blue-500" />}
              value={allappointments.length}
              label="Appointments"          
            />
            <StatCard
              icon={<FaStar className="text-yellow-500" />}
              value={averageRating}
              label="Avg Rating"
            />
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <DoctorProfileSection
              doctorId={doctorProfile.id}
              bio={doctorProfile.bio || ""}
              qualifications={doctorProfile.qualifications || ""}
              yearsExperience={doctorProfile.yearsExperience || 0}
            />

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 text-sm font-medium transition-colors">
                  <FaCalendarPlus /> New Slot
                </button>
                <button className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-lg text-green-600 dark:text-green-400 text-sm font-medium transition-colors">
                  <FaFileMedical /> Report
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column - Appointments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointments Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Upcoming Appointments
                </h2>
                <Link
                  href={`/dashboard/doctor/appointments`}
                  className="text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All <FaArrowRight className="text-xs" />
                </Link>
              </div>

              {allappointments.length === 0 ? (
                <div className="text-center py-8">
                  <FaCalendar className="mx-auto text-3xl text-gray-400 dark:text-gray-500 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    No appointments
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Schedule your first appointment
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allappointments.slice(0, 4).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <FaUser className="text-blue-500 text-sm" />
                            </div>
                            <h3 className="font-medium text-gray-800 dark:text-white">
                              {appointment.patientName}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : appointment.status === "cancelled"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <FaClock className="text-gray-400" />
                        {appointment.appointmentTime?.slice(0, 5)} -{" "}
                        {appointment.appointmentEndTime?.slice(0, 5)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Recent Reviews
                </h2>
                <Link
                  href="/dashboard/doctor/reviews"
                  className="text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All <FaArrowRight className="text-xs" />
                </Link>
              </div>

              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <FaComment className="mx-auto text-3xl text-gray-400 dark:text-gray-500 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    No reviews yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Patient reviews will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {comments.slice(0, 3).map((review) => (
                    <div
                      key={review.reviews.id}
                      className="pb-5 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        {review.users?.profileImage ? (
                          <Image
                            src={review.users.profileImage}
                            alt={review.users.name || ""}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                            {review.users?.name?.charAt(0) || "U"}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium text-gray-800 dark:text-white">
                              {review.users?.name || "Anonymous"}
                            </h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`text-sm ${
                                    i < review.reviews.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300 dark:text-gray-600"
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                {review.reviews.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            {new Date(
                              review.reviews.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                            {review.reviews.comment || "No comment provided."}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center gap-3">
    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">
        {value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  </div>
);
