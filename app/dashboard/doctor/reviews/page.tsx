import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { doctorProfiles, reviews, users } from "@/db/schema";
import Image from "next/image";
import { redirect } from "next/navigation";

import { FaFilter, FaSort, FaStar, FaComment } from "react-icons/fa";

export default async function DoctorReviews() {
  const session = await auth();
  if (!session || session.user?.role !== "doctor") {
    redirect("/not-found");
  }

  const doctorProfileResult = await db
    .select({ id: doctorProfiles.id })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, session.user.id));

  const doctorId = doctorProfileResult[0].id;

  const comments = await db
    .select()
    .from(reviews)
    .where(eq(reviews.doctorId, doctorId))
    .leftJoin(users, eq(reviews.patientId, users.id));
  return (
    <div className="max-w-4xl mx-auto p-6 text-sm md:text-base">
  {/* Reviews Header */}
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
      <FaStar className="text-yellow-400" />
      Patient Reviews
    </h1>
    <div className="flex gap-3">
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm">
        <FaFilter /> Filter
      </button>
      <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center gap-2 text-sm">
        <FaSort /> Sort
      </button>
    </div>
  </div>

  {/* Reviews Content */}
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
    {comments.length === 0 ? (
      <div className="text-center py-12">
        <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-5">
          <FaComment className="text-3xl text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          No reviews yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Patient feedback will appear here once they submit reviews after appointments.
        </p>
      </div>
    ) : (
      <div className="space-y-6">
        {comments.map((review) => (
          <div 
            key={review.reviews.id}
            className="p-5 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {review.users?.profileImage ? (
                <Image
                  src={review.users.profileImage}
                  alt={review.users.name || ""}
                  width={52}
                  height={52}
                  className="rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                />
              ) : (
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-600 dark:text-blue-300 font-medium text-lg">
                  {review.users?.name?.charAt(0) || "P"}
                </div>
              )}

              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {review.users?.name || "Anonymous Patient"}
                  </h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(review.reviews.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-lg mx-0.5 ${
                        i < review.reviews.rating
                          ? "text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {review.reviews.rating.toFixed(1)}/5
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300">
                  {review.reviews.comment || "No detailed feedback provided."}
                </p>

                {review.reviews.response && (
                  <div className="mt-4 pl-4 border-l-4 border-blue-200 dark:border-blue-800">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Your Response:
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {review.reviews.response}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
  );
}
