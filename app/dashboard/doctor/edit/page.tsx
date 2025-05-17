import { updateDoctorProfile } from "@/lib/actions";

interface DoctorProfileFormProps {
  doctorId: string;
  bio?: string | null;
  qualifications?: string | null;
  yearsExperience?: number | null;
}

export default function DoctorProfileForm({
  doctorId,
  bio = "",
  qualifications = "",
  yearsExperience = 0,
}: DoctorProfileFormProps) {
  return (
    <form action={updateDoctorProfile} className="space-y-4 max-w-lg border">
      <input type="hidden" name="doctorId" value={doctorId} />

      <div>
        <label className="block font-semibold mb-1">Bio</label>
        <textarea
          name="bio"
          className="w-full p-2 border rounded"
          defaultValue={bio || ""}
          rows={4}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Qualifications</label>
        <input
          type="text"
          name="qualifications"
          className="w-full p-2 border rounded"
          defaultValue={qualifications || ""}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div>
        <label className="block font-semibold mb-1">Years of Experience</label>
        <input
          type="number"
          name="yearsExperience"
          className="w-full p-2 border rounded"
          defaultValue={yearsExperience ?? 0}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 mt-7 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Save Profile
      </button>
      </div>
    </form>
  );
}
