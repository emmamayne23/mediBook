
import { db } from "@/db/drizzle";
import {
  appointments,
  doctorProfiles,
  timeAvailabilitySlots,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface PageProps {
  params: { slotId: string };
}

export default async function ConfirmAppointmentPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in"); // Protect page
  }

  const userId = session.user.id;
  const slotId = await params.slotId;

  const [slot] = await db
    .select({
      id: timeAvailabilitySlots.id,
      date: timeAvailabilitySlots.date,
      startTime: timeAvailabilitySlots.startTime,
      endTime: timeAvailabilitySlots.endTime,
      doctorId: timeAvailabilitySlots.doctorId,
      doctorName: users.name,
    })
    .from(timeAvailabilitySlots)
    .where(eq(timeAvailabilitySlots.id, slotId))
    .innerJoin(doctorProfiles, eq(timeAvailabilitySlots.doctorId, doctorProfiles.id))
    .innerJoin(users, eq(doctorProfiles.userId, users.id));

  if (!slot) {
    return <p className="text-center text-red-500 mt-10">Invalid slot selected.</p>;
  }

  async function handleConfirm() {
    "use server";

    if (!userId) {
      throw new Error("User ID is required");
    }

    await db.insert(appointments).values({
      patientId: userId,
      doctorId: slot.doctorId,
      slotId: slot.id,
      status: 'confirmed'
    });

    await db
      .update(timeAvailabilitySlots)
      .set({ isBooked: true })
      .where(eq(timeAvailabilitySlots.id, slot.id));

    revalidatePath("/appointments");
    redirect("/appointments/confirmed");
  };
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Confirm Your Appointment</h1>
      <div className="bg-gray-100 p-4 rounded shadow mb-4">
        <p>
          <strong>Doctor:</strong> {slot.doctorName}
        </p>
        <p>
          <strong>Date:</strong> {new Date(slot.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Time:</strong> {slot.startTime} - {slot.endTime}
        </p>
      </div>

      <form action={handleConfirm}>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Confirm Appointment
        </button>
      </form>
    </div>
  );
}
