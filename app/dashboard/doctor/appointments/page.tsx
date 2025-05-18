import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { db } from "@/db/drizzle"
import { eq } from "drizzle-orm"
import { appointments, users, timeAvailabilitySlots, doctorProfiles } from "@/db/schema"
import {
  FaClock,
  FaUser,
  FaCalendar,
} from "react-icons/fa";

type DoctorAppointmentsProps = {
    id: string
}

export default async function DoctorAppointments({ params }: { params: DoctorAppointmentsProps }) {
  const { id } = await params
  const session = await auth()
  if(!session || session.user?.role !== "doctor") {
    redirect("/not-found")
  } 

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
      .where(eq(appointments.doctorId, id));
  return (
    <div>
      <h1>Your Appointments</h1>

      {/* Appointments Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Upcoming Appointments
                </h2>
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
                  {allappointments.map((appointment) => (
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
    </div>
  )
}