import { db } from "@/db/drizzle";
import { appointments, users, doctorProfiles, specialties } from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FaCalendarAlt, FaUserMd, FaUser, FaSearch, FaFilter } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

import Image from "next/image";

export default async function AppointmentsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    redirect("/not-found");
  }

  const doctorUser = alias(users, "doctor_user");
  const patientUser = alias(users, "patient_user");

  const allAppointments = await db
    .select({ 
      id: appointments.id, 
      doctorName: doctorUser.name, 
      doctorImage: doctorUser.profileImage,
      patientName: patientUser.name,
      patientImage: patientUser.profileImage,
      specialty: specialties.specialty, 
      createdAt: appointments.createdAt,
      status: appointments.status
    })
    .from(appointments)
    .leftJoin(doctorProfiles, eq(doctorProfiles.id, appointments.doctorId))
    .leftJoin(doctorUser, eq(doctorProfiles.userId, doctorUser.id))
    .leftJoin(patientUser, eq(appointments.patientId, patientUser.id))
    .leftJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id))
    .orderBy(appointments.createdAt);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <FaCalendarAlt className="text-blue-500" />
              Appointments Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              View and manage all patient appointments
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm">
            {allAppointments.length} {allAppointments.length === 1 ? 'appointment' : 'appointments'}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
              />
            </div>
            <div className="relative">
              <select
                className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white py-2.5 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FaFilter className="absolute right-3 top-3 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {allAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto text-5xl text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                No Appointments Found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                There are currently no appointments scheduled.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {allAppointments.map((appt) => (
                <div key={appt.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4">
                      {appt.doctorImage ? (
                        <Image
                          src={appt.doctorImage}
                          width={48}
                          height={48}
                          alt={appt.doctorName || "Doctor"}
                          className="rounded-full border-2 border-white dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <FaUserMd className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Dr. {appt.doctorName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appt.specialty}</p>
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <h3 className="font-semibold text-gray-800 dark:text-white">{appt.patientName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Patient</p>
                      </div>
                      {appt.patientImage ? (
                        <Image
                          src={appt.patientImage}
                          width={48}
                          height={48}
                          alt={appt.patientName || "Patient"}
                          className="rounded-full border-2 border-white dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <FaUser className="text-gray-600 dark:text-gray-300 text-xl" />
                        </div>
                      )}
                    </div>

                    {/* Appointment Details */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <IoMdTime />
                        <span>
                          {new Date(appt.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <span className={`mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        appt.status === 'confirmed' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                          : appt.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                      }`}>
                        {appt.status?.charAt(0).toUpperCase() + appt.status?.slice(1)}
                      </span>
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