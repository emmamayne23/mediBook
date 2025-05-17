import { FaCalendarAlt, FaFilter, FaSearch } from "react-icons/fa";

export default async function DoctorAppointmentsPage() {
  // Fetch appointments filtered by doctorId

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" />
            Your Appointments
          </h1>
          <div className="flex gap-3">
            <div className="relative">
              <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 appearance-none">
                <option>All Status</option>
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
              <FaFilter className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-12 p-4 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-500 dark:text-gray-400">
            <div className="col-span-3">Patient</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Actions</div>
          </div>

          {allappointments.map(appointment => (
            <div key={appointment.id} className="grid grid-cols-12 p-4 items-center border-b border-gray-200 dark:border-gray-700">
              <div className="col-span-3 flex items-center gap-3">
                <FaUser className="text-gray-400" />
                <span className="font-medium text-gray-800 dark:text-white">
                  {appointment.patientName}
                </span>
              </div>
              <div className="col-span-2 text-gray-600 dark:text-gray-300">
                {new Date(appointment.appointmentDate).toLocaleDateString()}
              </div>
              <div className="col-span-2 text-gray-600 dark:text-gray-300">
                {appointment.appointmentTime}
              </div>
              <div className="col-span-2">
                <StatusBadge status={appointment.status} />
              </div>
              <div className="col-span-3 flex gap-2">
                <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  Details
                </button>
                {appointment.status === 'confirmed' && (
                  <button className="text-red-600 dark:text-red-400 hover:underline text-sm">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}