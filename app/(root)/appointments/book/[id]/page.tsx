import { db } from "@/db/drizzle";
import { users, doctorProfiles, timeAvailabilitySlots } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaUserMd, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import Image from "next/image";

interface ParamsProps {
  params: { id: string };
}

export default async function BookAppointmentPage({ params }: ParamsProps) {
  const { id } = await params;

  const [doctor] = await db
    .select()
    .from(doctorProfiles)
    .where(eq(doctorProfiles.id, id))
    .innerJoin(users, eq(doctorProfiles.userId, users.id));

  const slots = await db
    .select()
    .from(timeAvailabilitySlots)
    .where(and(
      eq(timeAvailabilitySlots.doctorId, id),
      eq(timeAvailabilitySlots.isBooked, false)
    ));

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md text-center">
          <FaUserMd className="text-5xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Doctor Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested doctor profile could not be found.
          </p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            <FaArrowLeft />
            Browse Doctors
          </Link>
        </div>
      </div>
    );
  }

  // Group slots by date
  const slotsByDate: Record<string, typeof slots> = {};
  slots.forEach(slot => {
    const dateStr = new Date(slot.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!slotsByDate[dateStr]) {
      slotsByDate[dateStr] = [];
    }
    slotsByDate[dateStr].push(slot);
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href={`/doctor/${id}`}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6"
        >
          <FaArrowLeft />
          Back to Doctor Profile
        </Link>

        {/* Doctor Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {doctor.doctor_profiles.imageUrl ? (
              <Image
                src={doctor.doctor_profiles.imageUrl || ""}
                width={120}
                height={120}
                alt={`Dr. ${doctor.users.name}`}
                className="rounded-full border-4 border-blue-100 dark:border-blue-900/50 object-cover"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-blue-600 text-white text-4xl font-bold rounded-full">
                {doctor.users.name?.[0]?.toUpperCase()}
              </div>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Book with Dr. {doctor.users.name}
              </h1>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                {doctor.doctor_profiles.qualifications}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {doctor.doctor_profiles.bio}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FaUserMd />
                <span>{doctor.doctor_profiles.yearsExperience}+ years experience</span>
              </div>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              Available Time Slots
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm">
              {slots.length} {slots.length === 1 ? 'slot' : 'slots'} available
            </span>
          </div>

          {slots.length === 0 ? (
            <div className="text-center py-8">
              <FaCalendarAlt className="mx-auto text-5xl text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                No Available Slots
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This doctor currently has no available appointment slots.
              </p>
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                <FaUserMd />
                Find Another Doctor
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(slotsByDate).map(([date, dateSlots]) => (
                <div key={date} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500" />
                    {date}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dateSlots.map((slot) => (
                      <Link
                        key={slot.id}
                        href={`/appointments/confirm/${slot.id}`}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-blue-500" />
                            <span className="font-medium text-gray-800 dark:text-white">
                              {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                            </span>
                          </div>
                          <FaCheckCircle className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Duration: {calculateDuration(slot.startTime, slot.endTime)}
                        </div>
                      </Link>
                    ))}
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