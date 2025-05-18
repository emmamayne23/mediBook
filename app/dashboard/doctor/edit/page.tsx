"use client";

import { useState } from "react";
import DoctorForm from "@/components/DoctorForm";
import { FaEdit } from "react-icons/fa";

interface DoctorProfileFormProps {
  doctorId: string;
  bio: string;
  qualifications: string;
  yearsExperience: number;
}

export default function DoctorProfileSection({
  doctorId,
  bio,
  qualifications,
  yearsExperience,
}: DoctorProfileFormProps) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 px-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Profile Information
        </h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FaEdit className="text-xs" /> {editing ? "Cancel" : "Edit"}
        </button>
      </div>
      {!editing ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 px-4 shadow-sm border border-gray-100 dark:border-gray-700">
            {/* <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Profile Information
              </h2>
            </div> */}

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bio
                </h3>
                <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">
                  {bio || "No bio provided."}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Qualifications
                </h3>
                <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">
                  {qualifications || "No qualifications listed."}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Experience
                </h3>
                <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">
                  {yearsExperience
                    ? `${yearsExperience} years`
                    : "No experience listed."}
                </p>
              </div>
            </div>
          </div>
      ) : (
        <DoctorForm
          doctorId={doctorId}
          bio={bio}
          qualifications={qualifications}
          yearsExperience={yearsExperience}
        />
      )}
    </div>
  );
}
