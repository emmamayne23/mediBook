import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { updateUserRole } from "@/lib/actions"

export default async function ManageUsersPage() {
  const allUsers = await db.select().from(users)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Manage User Roles</h1>

      {allUsers.map((user) => (
        <form
          key={user.id}
          action={updateUserRole}
          className="flex items-center justify-between border p-4 rounded-md"
        >
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <input type="hidden" name="userId" value={user.id} />
            <select
              name="role"
              defaultValue={user.role ?? ""}
              className="border rounded px-2 py-1"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
              <option value="receptionist">Recept</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Update
            </button>
          </div>
        </form>
      ))}
    </div>
  )
}
