import { db } from "@/db/drizzle";
import {
  users,
  doctorProfiles,
  timeAvailabilitySlots,
  reviews,
  appointments,
  specialties,
} from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function DoctorDashboardPage() {
  const session = await auth();
  if (!session || session.user?.role !== "doctor") {
    redirect("/not-found");
  }
  const doctorId = await session.user.id;
  const doctor = await db
    .select()
    .from(users)
    .where(eq(users.id, doctorId))
    .then((res) => res[0]);

  const [doctorProfile] = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, doctorId));

  const [specialty] = await db
    .select()
    .from(specialties)
    .where(eq(specialties.id, doctorProfile.specialtyId));

  const [timeAvailability] = await db
    .select()
    .from(timeAvailabilitySlots)
    .where(eq(timeAvailabilitySlots.doctorId, doctorId));

  const [comments] = await db
    .select()
    .from(reviews)
    .where(eq(reviews.doctorId, doctorId));

  const allappointments = await db
    .select({ id: appointments.id, status: appointments.status, patientName: users.name, appointmentDate: timeAvailabilitySlots.date, appointmentTime: timeAvailabilitySlots.startTime })
    .from(appointments)
    .leftJoin(doctorProfiles, eq(appointments.doctorId, doctorProfiles.id))
    .leftJoin(users, eq(appointments.patientId, users.id))
    .leftJoin(timeAvailabilitySlots, eq(appointments.slotId, timeAvailabilitySlots.id))
    .where(and (eq(appointments.doctorId, doctorId)))
  return (
    <div>
      <div className="p-6 space-y-10">
        <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Welcome, Dr. {doctor.name}
          </h2>
          <span className="text-xl font-semibold mb-2">email: </span>
          <span>{doctor.email}</span>
          <div>
            <Image
              src={doctorProfile.imageUrl ?? ""}
              alt="doctor profile image"
              width={100}
              height={100}
              className="w-full object-cover"
            />
          </div>
        </div>

        <section>
          {/* Profile Section */}
          <section className="border rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
            {doctorProfile ? (
              <div className="space-y-1">
                <p>
                  <strong>Bio:</strong> {doctorProfile.bio}
                </p>
                <p>
                  <strong>Qualifications:</strong>{" "}
                  {doctorProfile.qualifications}
                </p>
                <p>
                  <strong>Years of Experience:</strong>{" "}
                  {doctorProfile.yearsExperience}
                </p>
                <p>
                  <strong>Specialty:</strong> {specialty.specialty}
                </p>
                {/* TODO: Add edit button */}
              </div>
            ) : (
              <p>You haven’t created your doctor profile yet.</p>
            )}
          </section>
          <Link href={"/dashboard/doctor/update"} className="border text-xl font-semibold rounded-lg px-5 py-2 text-center">
            Edit Your Profile
          </Link>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            Create Availability Slots
          </h2>
          {/* <TimeSlotForm doctorId={doctorId} /> */}
        </section>

        <section>
          {/* Appointments */}
                <div className="my-10">
                  <h2 className="text-xl font-semibold mb-4">Appointments History</h2>
                  {allappointments.length === 0 ? (
                    <p className="text-gray-500">No appointments yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {allappointments.map((appointment) => (
                        <div
                          key={appointment.id}
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
                            <strong>Patient:</strong>
                            {appointment.patientName}
                          </p>
                          <p className="text-gray-700 flex items-center gap-2"><strong>Time: </strong> {appointment.appointmentTime}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Patients Reviews</h2>
          {/* <ReviewSummary reviews={doctorReviews} /> */}
        </section>
      </div>
    </div>
  );
}
