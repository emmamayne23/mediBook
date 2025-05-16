import { db } from "@/db/drizzle";
import { reviews, users, doctorProfiles, specialties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { FaStar, FaUserMd, FaUser, FaCalendarAlt } from "react-icons/fa";
import { IoMdStarHalf, IoMdStarOutline } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ReviewsPage() {
    const session = await auth()
  if(!session || session.user?.role !== "admin") {
    redirect ("/not-found")
  }
  const doctorUser = alias(users, "doctor_user");
  const patientUser = alias(users, "patient_user");

  const allReviews = await db
    .select({
      id: reviews.id,
      comment: reviews.comment,
      rating: reviews.rating,
      createdAt: reviews.createdAt,
      doctorName: doctorUser.name,
      doctorImage: doctorUser.profileImage,
      patientName: patientUser.name,
      patientImage: patientUser.profileImage,
      specialty: specialties.specialty,
    })
    .from(reviews)
    .leftJoin(doctorProfiles, eq(doctorProfiles.id, reviews.doctorId))
    .leftJoin(doctorUser, eq(doctorProfiles.userId, doctorUser.id))
    .leftJoin(patientUser, eq(reviews.patientId, patientUser.id))
    .leftJoin(specialties, eq(doctorProfiles.specialtyId, specialties.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-3">
              <FaStar className="text-yellow-500" />
              Patient Reviews
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              What our patients say about their healthcare experience
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm">
            {allReviews.length} {allReviews.length === 1 ? 'Review' : 'Reviews'}
          </div>
        </div>

        {/* Reviews Grid */}
        {allReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
              >
                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex mr-3">
                    {[...Array(5)].map((_, i) => {
                      const starValue = i + 1;
                      if (starValue <= review.rating) {
                        return <FaStar key={i} className="text-yellow-400" />;
                      }
                      if (starValue - 0.5 <= review.rating) {
                        return <IoMdStarHalf key={i} className="text-yellow-400" />;
                      }
                      return <IoMdStarOutline key={i} className="text-yellow-400" />;
                    })}
                  </div>
                  <span className="text-lg font-semibold text-gray-800 dark:text-white">
                    {review.rating.toFixed(1)}
                  </span>
                </div>

                {/* Review Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
                  &quot;{review.comment}&quot;
                </p>

                {/* Review Footer */}
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    {/* Patient Info */}
                    <div className="flex items-center gap-3">
                      {review.patientImage ? (
                        <Image
                          src={review.patientImage}
                          width={40}
                          height={40}
                          alt={review.patientName || "Patient"}
                          className="rounded-full border-2 border-white dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <FaUser className="text-gray-600 dark:text-gray-300" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {review.patientName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Patient</p>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium text-gray-800 dark:text-white">
                          Dr. {review.doctorName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {review.specialty}
                        </p>
                      </div>
                      {review.doctorImage ? (
                        <Image
                          src={review.doctorImage}
                          width={40}
                          height={40}
                          alt={review.doctorName || "Doctor"}
                          className="rounded-full border-2 border-white dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <FaUserMd className="text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center justify-end gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <FaCalendarAlt />
                    <span>
                      {review.createdAt?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <FaStar className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Patient reviews will appear here once they&apos;re submitted.
            </p>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              <FaUserMd />
              Find Doctors
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// import { db } from "@/db/drizzle";
// import { reviews, users, doctorProfiles } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { alias } from "drizzle-orm/pg-core";

// export default async function ReviewsPage() {
//   // Create aliases for users table to distinguish between doctor and patient
//   const doctorUser = alias(users, "doctor_user");
//   const patientUser = alias(users, "patient_user");

//   const allReviews = await db
//     .select({
//       id: reviews.id,
//       comment: reviews.comment,
//       rating: reviews.rating,
//       createdAt: reviews.createdAt,
//       doctorName: doctorUser.name,
//       patientName: patientUser.name,
//       doctorSpecialty: doctorProfiles.specialtyId, // You might want to join specialties table for the name
//     })
//     .from(reviews)
//     .leftJoin(doctorProfiles, eq(doctorProfiles.id, reviews.doctorId))
//     .leftJoin(doctorUser, eq(doctorProfiles.userId, doctorUser.id))
//     .leftJoin(patientUser, eq(reviews.patientId, patientUser.id));

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Patient Reviews</h1>

//       <div className="grid gap-6">
//         {allReviews.map((review) => (
//           <div
//             key={review.id}
//             className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
//           >
//             <div className="flex items-center justify-between mb-2">
//               <h2 className="text-xl font-semibold">
//                 {review.patientName}&apos;s Review
//               </h2>
//               <div className="flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <span
//                     key={i}
//                     className={`text-xl ${
//                       i < review.rating ? "text-yellow-500" : "text-gray-300"
//                     }`}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <p className="text-gray-700 mb-4">{review.comment}</p>

//             <div className="flex justify-between text-sm text-gray-500">
//               <p>Dr. {review.doctorName}</p>
//               <p>
//                 {review.createdAt?.toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
