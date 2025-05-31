import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import {
  appointments,
  users,
  timeAvailabilitySlots,
  doctorProfiles,
} from "@/db/schema";
import {
  FaClock,
  FaCalendarTimes,
  FaChevronRight,
  FaCalendarAlt,
  FaPlus,
  FaUser,
  FaChevronLeft,
} from "react-icons/fa";
import { AppointmentActions } from "@/components/AppointmentActions";

export default async function DoctorAppointmentsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "doctor") {
    redirect("/not-found");
  }

  const doctorProfileResult = await db
    .select({ id: doctorProfiles.id })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, session.user.id));

  if (!doctorProfileResult.length) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Doctor Profile Not Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Please complete your doctor profile setup first.
          </p>
        </div>
      </div>
    );
  }

  const doctorProfileId = doctorProfileResult[0].id;

  const allappointments = await db
    .select({
      id: appointments.id,
      status: appointments.status,
      patientName: users.name,
      appointmentDate: timeAvailabilitySlots.date,
      appointmentTime: timeAvailabilitySlots.startTime,
      appointmentEndTime: timeAvailabilitySlots.endTime,
      reason: appointments.reason
    })
    .from(appointments)
    .leftJoin(doctorProfiles, eq(appointments.doctorId, doctorProfiles.id))
    .leftJoin(users, eq(appointments.patientId, users.id))
    .leftJoin(
      timeAvailabilitySlots,
      eq(appointments.slotId, timeAvailabilitySlots.id)
    )
    .where(eq(appointments.doctorId, doctorProfileId));

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Appointments Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <FaCalendarAlt className="text-blue-500" />
          My Appointments
        </h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm">
          <FaPlus /> <span className="hidden sm:flex">New Appointment</span>{" "}
          <span className="flex sm:hidden">New</span>
        </button>
      </div>

      {/* Date Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex items-center justify-between">
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FaChevronLeft />
          </button>
          <h3 className="font-medium text-gray-800 dark:text-white">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Appointments Content */}
      <div className="space-y-4">
        {allappointments.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-5">
              <FaCalendarTimes className="text-3xl text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No appointments scheduled
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You don&apos;t have any appointments for this time period.
            </p>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              Create New Appointment
            </button>
          </div>
        ) : (
          allappointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <FaUser className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {appointment.patientName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                        <FaClock className="text-xs" />
                        {appointment.appointmentTime?.slice(0, 5)} -{" "}
                        {appointment.appointmentEndTime?.slice(0, 5)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {appointment.reason && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="font-medium text-blue-500">Reason:</span>{" "}
                        {appointment.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 sm:self-start">
                  <span
                    className={`px-3 py-1 flex justify-center items-center text-xs rounded-full ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : appointment.status === "cancelled"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  <button className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <AppointmentActions
                      appointmentId={appointment.id}
                      currentStatus={appointment.status || "confirmed"}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
