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
import { FaCalendarCheck, FaClock, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: { slotId: string };
}

export default async function ConfirmAppointmentPage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
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
      doctorImage: users.profileImage,
      doctorQualifications: doctorProfiles.qualifications,
      doctorSpecialty: doctorProfiles.specialtyId,
    })
    .from(timeAvailabilitySlots)
    .where(eq(timeAvailabilitySlots.id, slotId))
    .innerJoin(doctorProfiles, eq(timeAvailabilitySlots.doctorId, doctorProfiles.id))
    .innerJoin(users, eq(doctorProfiles.userId, users.id));

  if (!slot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
          <FaCalendarCheck className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Invalid Slot</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The selected appointment slot is no longer available.
          </p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            <FaArrowLeft />
            Find Available Doctors
          </Link>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <Link
          href={`/doctor/${slot.doctorId}`}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
        >
          <FaArrowLeft />
          Back to Doctor
        </Link>

        {/* Confirmation Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 p-6 text-white text-center">
            <FaCalendarCheck className="text-4xl mx-auto mb-3" />
            <h1 className="text-2xl font-bold">Confirm Your Appointment</h1>
          </div>

          {/* Doctor Info */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              {slot.doctorImage ? (
                <Image
                  src={slot.doctorImage}
                  width={80}
                  height={80}
                  alt={`Dr. ${slot.doctorName}`}
                  className="rounded-full border-4 border-blue-100 dark:border-blue-900/50 object-cover"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-blue-600 text-white text-3xl font-bold rounded-full">
                  {slot.doctorName?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dr. {slot.doctorName}</h2>
                <p className="text-blue-600 dark:text-blue-400">{slot.doctorQualifications}</p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
              <FaCalendarCheck className="text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium">
                  {new Date(slot.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
              <FaClock className="text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p className="font-medium">
                  {slot.startTime} - {slot.endTime} ({calculateDuration(slot.startTime, slot.endTime)})
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Button */}
          <form action={handleConfirm} className="p-6 pt-0">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-300"
            >
              <FaCheckCircle />
              Confirm Appointment
            </button>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>You&apos;ll receive a confirmation email with appointment details.</p>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate duration
function calculateDuration(startTime: string, endTime: string): string {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return hours > 0 
    ? `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} minutes` : ''}`.trim()
    : `${minutes} minutes`;
}