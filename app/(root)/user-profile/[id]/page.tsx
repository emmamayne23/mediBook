import { db } from "@/db/drizzle";
import { users, appointments, doctorProfiles, timeAvailabilitySlots } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

interface UserProfilePageProps {
  id: string;
}

export default async function UserProfilePage({ params }: { params: UserProfilePageProps }) {
  const { id } = await params;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((res) => res[0]);

  const allAppointments = await db
    .select({
      appointmentId: appointments.id,
      status: appointments.status,
      doctorName: users.name,
      doctorProfileImage: users.profileImage,
      appointmentDate: timeAvailabilitySlots.date,
      appointmentTime: timeAvailabilitySlots.startTime
    })
    .from(appointments)
    .leftJoin(doctorProfiles, eq(appointments.doctorId, doctorProfiles.id))
    .leftJoin(users, eq(doctorProfiles.userId, users.id))
    .leftJoin(timeAvailabilitySlots, eq(appointments.slotId, timeAvailabilitySlots.id))
    .where(eq(appointments.patientId, id));

  return (
    <div className="text-center max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">User Profile Page</h1>

      {/* User info */}
      <div className="space-y-2 mb-12">
        <h2 className="text-xl font-semibold">User Profile</h2>
        {user.profileImage ? (
          <Image
            src={user.profileImage}
            width={60}
            height={60}
            alt={user.name || "User"}
            className="rounded-full border mx-auto"
          />
        ) : (
          <div className="font-semibold text-3xl w-12 h-12 flex justify-center items-center mx-auto bg-blue-600 text-white rounded-full">
            {(user.name?.[0] ?? "").toUpperCase()}
          </div>
        )}
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Appointments */}
      <div className="my-10">
        <h2 className="text-xl font-semibold mb-4">Appointments History</h2>
        {allAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments yet.</p>
        ) : (
          <div className="space-y-4">
            {allAppointments.map((appointment) => (
              <div
                key={appointment.appointmentId}
                className="border p-4 rounded-lg text-left shadow-md"
              >
                <p className="text-gray-700">
                  <strong>Status:</strong> {appointment.status}
                </p>
                <p className="text-gray-700">
                  <strong>Date:</strong>{" "}
                  {appointment.appointmentDate
                    ? new Date(appointment.appointmentDate).toDateString()
                    : "Not specified"}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  <strong>Doctor:</strong>
                  {appointment.doctorProfileImage ? (
                    <Image
                      src={appointment.doctorProfileImage}
                      width={30}
                      height={30}
                      alt={appointment.doctorName ?? ""}
                      className="rounded-full"
                    />
                  ) : null}
                  {appointment.doctorName || "Unknown"}
                </p>
                <p className="text-gray-700 flex items-center gap-2"><strong>Time: </strong> {appointment.appointmentTime}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
