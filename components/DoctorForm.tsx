import { updateDoctorProfile } from "@/lib/actions";

interface DoctorProfileFormProps {
  doctorId: string;
  bio: string;
  qualifications: string;
  yearsExperience: number;
}

export default function DoctorForm({
  doctorId,
  bio,
  qualifications,
  yearsExperience,
}: DoctorProfileFormProps) {
  return (
    <form
      action={updateDoctorProfile}
      className="space-y-6 max-w-2xl p-6 border text-sm border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
    >
      <input type="hidden" name="doctorId" value={doctorId} />

      {/* Bio Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio
          <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
            (Max 500 characters)
          </span>
        </label>
        <textarea
          name="bio"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
          defaultValue={bio}
          rows={5}
          maxLength={500}
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {bio?.length || 0}/500 characters
        </div>
      </div>

      {/* Qualifications Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Qualifications
        </label>
        <input
          type="text"
          name="qualifications"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
          defaultValue={qualifications}
          placeholder="MD, PhD, etc."
        />
      </div>

      {/* Experience & Submit Section */}
      <div className="flex flex-col gap-6 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Years of Experience
          </label>
          <div className="relative">
            <input
              type="number"
              name="yearsExperience"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all appearance-none"
              defaultValue={yearsExperience}
              min="0"
              max="50"
            />
            <span className="absolute right-14 top-3 text-gray-500 dark:text-gray-400">
              yrs
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-full sm:w-auto"
        >
          Update Profile
          <span className="ml-2">→</span>
        </button>
      </div>
    </form>
  );
}
