import { db } from "@/db/drizzle"
import { users, doctorProfiles, timeAvailabilitySlots } from "@/db/schema"
import { eq, and } from "drizzle-orm"

import Link from "next/link"

interface ParamsProps {
    params: { id: string }
}

export default async function BookAppointmentPage({ params }: ParamsProps) {
    const { id } = await params

    const [doctor] = await db
      .select()
      .from(doctorProfiles)
      .where(eq(doctorProfiles.id, id))
      .innerJoin(users, eq(doctorProfiles.userId, users.id))

      const slots = await db
        .select()
        .from(timeAvailabilitySlots)
        .where(and(eq(timeAvailabilitySlots.doctorId, id), eq(timeAvailabilitySlots.isBooked, false)))

        if (!doctor) return <p>Doctor not found.</p>;
    return (
        <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Book an Appointment with {doctor.users.name}</h1>

      <div className="mb-6">
        <p className="text-gray-600">{doctor.doctor_profiles.bio}</p>
        <p className="text-sm text-gray-500 mt-1">{doctor.doctor_profiles.qualifications}</p>
      </div>

      <h2 className="text-xl font-semibold mb-3">Available Time Slots</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slots.length === 0 ? (
          <p className="text-gray-400">No available slots for now.</p>
        ) : (
          slots.map((slot) => (
            <li key={slot.id} className="border p-4 rounded shadow-sm">
              <p>
                <strong>Date:</strong> {new Date(slot.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {slot.startTime} - {slot.endTime}
              </p>
              <Link
                href={`/appointments/confirm/${slot.id}`}
                className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Book This Slot
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
    )
}