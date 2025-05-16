import {
  FaCalendarCheck,
  FaCheckCircle,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import Link from "next/link";
import { auth } from "@/auth";
export default async function ConfirmedPage() {
  const session = await auth();
  const user = session?.user
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 p-6 text-white text-center">
          <FaCalendarCheck className="text-5xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Appointment Confirmed</h1>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-4xl text-green-500 dark:text-green-400" />
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 text-gray-800 dark:text-gray-200">
              <FaEnvelope className="text-blue-500" />
              <p>A confirmation with all details has been sent to your email</p>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-800 dark:text-gray-200">
              <FaClock className="text-blue-500" />
              <p>
                We&apos;ll send you a reminder 24 hours before your appointment
              </p>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Need to make changes? Contact our support team at least 12 hours
              before your scheduled time.
            </p>
          </div>

          <Link
            href={`/user-profile/${user.id}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            View My Appointments
          </Link>
        </div>
      </div>
    </div>
  );
}
