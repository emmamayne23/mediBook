import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { db } from "@/db/drizzle";
import {
  users,
  specialties,
  appointments,
  doctorProfiles,
  timeAvailabilitySlots,
  reviews,
} from "@/db/schema";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  const allusers = await db.select().from(users);
  const allspecialties = await db.select().from(specialties);
  const allappointments = await db.select().from(appointments);
  const alldoctorProfiles = await db.select().from(doctorProfiles);
  const alltimeAvailabilitySlots = await db.select().from(timeAvailabilitySlots);
  const allreviews = await db.select().from(reviews);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-6 space-y-6">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        <nav>
          <ul>
            <li>
              <a href="#" className="block py-2 hover:bg-gray-700 px-4 rounded">
                Overview
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 hover:bg-gray-700 px-4 rounded">
                Users
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 hover:bg-gray-700 px-4 rounded">
                Appointments
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 hover:bg-gray-700 px-4 rounded">
                Doctors
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 hover:bg-gray-700 px-4 rounded">
                Reviews
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 hover:bg-gray-700 px-4 rounded">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-6">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-blue-600">Welcome, {session.user?.name} 👋</h1>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Logout
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">{allusers.length}</p>
            </div>
            <div className="text-blue-500 text-4xl">👥</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Specialties</h3>
              <p className="text-2xl font-bold text-gray-900">{allspecialties.length}</p>
            </div>
            <div className="text-green-500 text-4xl">💼</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Appointments</h3>
              <p className="text-2xl font-bold text-gray-900">{allappointments.length}</p>
            </div>
            <div className="text-yellow-500 text-4xl">📅</div>
          </div>
        </div>

        {/* Other Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800">Doctors</h3>
            <p className="text-2xl font-bold text-gray-900">{alldoctorProfiles.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800">Time Slots</h3>
            <p className="text-2xl font-bold text-gray-900">{alltimeAvailabilitySlots.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800">Reviews</h3>
            <p className="text-2xl font-bold text-gray-900">{allreviews.length}</p>
          </div>
        </div>

        {/* Placeholder for charts, etc. */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Chart Section</h3>
          <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            Chart goes here
          </div>
        </div>
      </div>
    </div>
  );
}
