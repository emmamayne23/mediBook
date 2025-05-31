import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import {
  appointments,
  timeAvailabilitySlots,
  users,
  doctorProfiles,
  reviews,
  specialties,
} from "@/db/schema";
import { auth } from "@/auth";

import Image from "next/image";
import {
  FaClock,
  FaCalendarAlt,
  FaUserMd,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";
import { StarRating } from "@/components/StarRating";

type AppointmentDetailsProps = {
  id: string;
};

export default async function AppointmentDetailsPage({
  params,
}: {
  params: AppointmentDetailsProps;
}) {
  const session = await auth();
  const { id } = await params;
  const userId = session?.user?.id;

  const [appointmentDetail] = await db
    .select({
      appointmentId: appointments.id,
      status: appointments.status,
      doctorName: users.name,
      doctorId: doctorProfiles.id,
      doctorProfileImage: doctorProfiles.imageUrl,
      appointmentDate: timeAvailabilitySlots.date,
      appointmentTime: timeAvailabilitySlots.startTime,
      reason: appointments.reason,
      specialty: specialties.specialty,
    })
    .from(appointments)
    .leftJoin(doctorProfiles, eq(appointments.doctorId, doctorProfiles.id))
    .leftJoin(users, eq(users.id, doctorProfiles.userId))
    .leftJoin(
      timeAvailabilitySlots,
      eq(timeAvailabilitySlots.id, appointments.slotId)
    )
    .leftJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id))
    .where(eq(appointments.id, id));

  async function handleReviewSubmit(formData: FormData) {
    "use server";

    const comment = formData.get("comment") as string;
    const rating = Number(formData.get("rating"));
    const doctorId = appointmentDetail.doctorId;

    if (!userId || !doctorId) {
      throw new Error("User ID and Doctor ID is required");
    }

    await db.insert(reviews).values({
      patientId: userId,
      doctorId: doctorId,
      rating: rating,
      comment: comment,
    });
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Appointment Details
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review your appointment information
        </p>
      </div>

      {/* Appointment Card */}
      <div
        className={`p-6 rounded-xl shadow-lg transition-all duration-300 ${
          appointmentDetail.status === "completed"
            ? "border-l-4 border-green-500 bg-white dark:bg-gray-800"
            : appointmentDetail.status === "cancelled"
            ? "border-l-4 border-red-500 bg-white dark:bg-gray-800"
            : "border-l-4 border-blue-500 bg-white dark:bg-gray-800"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Info */}
          <div className="flex items-start gap-4 flex-1">
            {appointmentDetail.doctorProfileImage ? (
              <Image
                src={appointmentDetail.doctorProfileImage}
                width={80}
                height={80}
                alt={appointmentDetail.doctorName ?? "Doctor"}
                className="rounded-full border-4 border-white dark:border-gray-700 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                <FaUserMd className="text-2xl" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Dr. {appointmentDetail.doctorName || "Unknown"}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                {appointmentDetail.specialty || "General Practitioner"}
              </p>

              {/* Reason */}
              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Appointment Reason
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {appointmentDetail.reason || "No reason specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FaCalendarAlt className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p>
                  {appointmentDetail.appointmentDate
                    ? new Date(
                        appointmentDetail.appointmentDate
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FaClock className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p>{appointmentDetail.appointmentTime || "Not specified"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointmentDetail.status === "completed"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                    : appointmentDetail.status === "cancelled"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                }`}
              >
                {appointmentDetail.status?.charAt(0).toUpperCase() +
                  appointmentDetail.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {appointmentDetail.status === "completed" && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            Share Your Experience
          </h2>

          <form action={handleReviewSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How would you rate your experience? *
              </label>
              <StarRating name="rating" required />
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Your Review (Optional)
              </label>
              <textarea
                name="comment"
                id="comment"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                placeholder="Share details about your experience..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <FaCheckCircle />
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
