import { db } from "@/db/drizzle";
import { users, doctorProfiles, specialties, appointments, reviews, timeAvailabilitySlots } from "@/db/schema";

import {
  FiUsers,
  FiCalendar,
  FiUserPlus,
  FiClock,
  FiStar,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
} from "react-icons/fi";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminPieChart } from "@/components/pie-chart";
import { BarChartComponent } from "@/components/bar-chart";

export default async function AdminDashboardPage() {
  const session = await auth()
  if(!session || session.user?.role !== "admin") {
    redirect ("/not-found")
  }
  
  const allusers = await db.select().from(users)
  const allspecialties = await db.select().from(specialties);
  const allappointments = await db.select().from(appointments);
  const allreviews = await db.select().from(reviews);
  const alltimeSlots = await db.select().from(timeAvailabilitySlots);
  const alldoctors = await db.select().from(doctorProfiles);

  const stats = {
    users: allusers.length,
    specialties: allspecialties.length,
    appointments: allappointments.length,
    doctors: alldoctors.length,
    timeSlots: alltimeSlots.length,
    reviews: allreviews.length,
  };

  return (
    <div className="py-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, Admin {session.user.name}!</h2>
        <p className="opacity-90">
          Here&apos;s what&apos;s happening with your platform today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {[
          {
            title: "Total Users",
            value: stats.users,
            icon: <FiUsers className="text-3xl" />,
            color: "bg-blue-100 dark:bg-blue-900/50",
            textColor: "text-blue-600 dark:text-blue-400",
          },
          {
            title: "Specialties",
            value: stats.specialties,
            icon: <FiUserPlus className="text-3xl" />,
            color: "bg-green-100 dark:bg-green-900/50",
            textColor: "text-green-600 dark:text-green-400",
          },
          {
            title: "Appointments",
            value: stats.appointments,
            icon: <FiCalendar className="text-3xl" />,
            color: "bg-purple-100 dark:bg-purple-900/50",
            textColor: "text-purple-600 dark:text-purple-400",
          },
          {
            title: "Doctors",
            value: stats.doctors,
            icon: <FiUserPlus className="text-3xl" />,
            color: "bg-yellow-100 dark:bg-yellow-900/50",
            textColor: "text-yellow-600 dark:text-yellow-400",
          },
          {
            title: "Time Slots",
            value: stats.timeSlots,
            icon: <FiClock className="text-3xl" />,
            color: "bg-red-100 dark:bg-red-900/50",
            textColor: "text-red-600 dark:text-red-400",
          },
          {
            title: "Reviews",
            value: stats.reviews,
            icon: <FiStar className="text-3xl" />,
            color: "bg-indigo-100 dark:bg-indigo-900/50",
            textColor: "text-indigo-600 dark:text-indigo-400",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <h3 className={`text-2xl font-bold mt-1 ${stat.textColor}`}>
                  {stat.value}
                </h3>
              </div>
              <div className={`p-3 rounded-full ${stat.textColor}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-3">
              Appointments Trend <FiTrendingUp className="text-3xl" />
            </h3>
            <FiBarChart2 className="text-gray-500 dark:text-gray-400" />
          </div>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 overflow-auto">
            <span className="">
              <BarChartComponent />
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-3">
              User Distribution <FiPieChart className="text-3xl" />
            </h3>
            <FiPieChart className="text-gray-500 dark:text-gray-400" />
          </div>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
            <span className="-ml-10">
              <AdminPieChart />
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
            >
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
                <FiUserPlus className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  New user registered #{Math.floor(Math.random() * 50)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.floor(Math.random() * 12) + 1} hours ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}