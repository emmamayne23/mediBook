import { db } from "@/db/drizzle";
import { users, appointments, doctorProfiles, timeAvailabilitySlots, specialties } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { FaUserCircle, FaCalendarAlt, FaClock, FaUserMd, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/auth";

import { SignOut } from "@/components/sign-out";

interface UserProfilePageProps {
  id: string;
}

export default async function UserProfilePage({ params }: { params: UserProfilePageProps }) {
  const session = await auth();
  const { id } = await params;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((res) => res[0]);

    const doctor = await db
      .select()
      .from(doctorProfiles)
      .where(eq(doctorProfiles.userId, id))
      .then((res) => res[0]); 

  const allAppointments = await db
    .select({
      appointmentId: appointments.id,
      status: appointments.status,
      doctorName: users.name,
      doctorProfileImage: users.profileImage,
      appointmentDate: timeAvailabilitySlots.date,
      appointmentTime: timeAvailabilitySlots.startTime,
      specialty: specialties.specialty
    })
    .from(appointments)
    .leftJoin(doctorProfiles, eq(appointments.doctorId, doctorProfiles.id))
    .leftJoin(users, eq(doctorProfiles.userId, users.id))
    .leftJoin(timeAvailabilitySlots, eq(appointments.slotId, timeAvailabilitySlots.id))
    .leftJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id))
    .where(eq(appointments.patientId, id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 mb-8 md:flex md:justify-between">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                width={120}
                height={120}
                alt={user.name || "User"}
                className="rounded-full border-4 border-blue-100 dark:border-blue-900/50 object-cover"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-600 dark:text-blue-300 text-5xl font-bold rounded-full">
                <p>{user.name?.charAt(0) || "U"}</p>
              </div>
            )}
            
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{user.email}</p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaUserCircle className="text-blue-500" />
                  <span>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-3 space-y-5">
            <SignOut />
            {session?.user?.role === "doctor" && (
              <Link href={`/dashboard/doctor/`} className="bg-blue-500 hover:bg-blue-600 text-white duration-300 font-bold py-3 px-5 rounded-xl mt-2">
                Doctor Dashboard
              </Link>
            )}
            {session?.user?.role === "admin" && (
              <Link href={`/admin`} className="bg-blue-500 hover:bg-blue-600 text-white duration-300 font-bold py-3 px-5 rounded-xl mt-2">
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <div className="flex flex-col gap-3 md:flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              Appointments History
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
              {allAppointments.length} {allAppointments.length === 1 ? 'appointment' : 'appointments'}
            </span>
          </div>

          {allAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                No appointments yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You haven&apos;t booked any appointments yet.
              </p>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                <FaUserMd />
                Find a Doctor
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {allAppointments.map((appointment) => (
                <div
                  key={appointment.appointmentId}
                  className={`p-6 rounded-lg border transition-all duration-300 ${
                    appointment.status === 'completed' 
                      ? 'border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20'
                      : appointment.status === 'cancelled'
                      ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20'
                      : 'border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4">
                      {appointment.doctorProfileImage ? (
                        <Image
                          src={appointment.doctorProfileImage}
                          width={50}
                          height={50}
                          alt={appointment.doctorName ?? "Doctor"}
                          className="rounded-full border-2 border-white dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          <FaUserMd />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          Dr. {appointment.doctorName || "Unknown"}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {appointment.specialty || "General Practitioner"}
                        </p>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex-1 md:text-right">
                      <div className="flex flex-wrap items-center gap-4 justify-between">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <FaCalendarAlt className="text-blue-500" />
                          <span>
                            {appointment.appointmentDate
                              ? new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })
                              : "Date not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <FaClock className="text-blue-500" />
                          <span>{appointment.appointmentTime || "Time not specified"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'completed'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                    }`}>
                      {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                    </span>
                    
                    <div className="flex gap-2">
                      <Link
                        href={`/appointments/${appointment.appointmentId}`}
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <FaInfoCircle />
                        Details
                      </Link>
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