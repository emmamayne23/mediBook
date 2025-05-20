import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { updateUserRole } from "@/lib/actions";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { FaUser, FaUserMd, FaUserShield, FaUserTie, FaSave } from "react-icons/fa";

export default async function ManageUsersPage() {
  const session = await auth()
  if(!session || session.user?.role !== "admin") {
    redirect ("/not-found")
  }
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt))

  const roleIcons = {
    patient: <FaUser className="text-blue-500" />,
    doctor: <FaUserMd className="text-green-500" />,
    admin: <FaUserShield className="text-purple-500" />,
    receptionist: <FaUserTie className="text-orange-500" />,
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaUserShield className="text-blue-500" />
            Manage User Roles
          </h1>
          <div className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full">
            {allUsers.length} {allUsers.length === 1 ? 'User' : 'Users'}
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {allUsers.map((user) => (
            <form
              key={user.id}
              action={updateUserRole}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  {user.role ? (
                    roleIcons[user.role as keyof typeof roleIcons] || <FaUser />
                  ) : (
                    <FaUser />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="hidden" name="userId" value={user.id} />
                <div className="relative">
                  <select
                    name="role"
                    defaultValue={user.role ?? "patient"}
                    className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                    <option value="receptionist">Receptionist</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
                >
                  <FaSave className="text-sm" />
                  <span>Update</span>
                </button>
              </div>
            </form>
          ))}
        </div>

        {allUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FaUser className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              No Users Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are currently no users in the system.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}