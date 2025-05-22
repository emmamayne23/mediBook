// components/AppointmentActions.tsx
"use client";

import { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { updateAppointmentStatus } from "@/lib/actions";
import { useTransition } from "react";

type Props = {
  appointmentId: string;
  currentStatus: "confirmed" | "completed" | "cancelled";
};

export function AppointmentActions({ appointmentId, currentStatus }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  const handleChangeStatus = (newStatus: "completed" | "cancelled") => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("appointmentId", appointmentId);
      formData.append("status", newStatus);
      updateAppointmentStatus(formData).then(() => {
        setStatus(newStatus);
        setShowMenu(false);
      });
    });
  };

  return (
    <div className="relative">
      <button
        className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <FaEllipsisH />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md z-10">
          <button
            onClick={() => handleChangeStatus("completed")}
            className="w-full text-left text-green-600 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
            disabled={isPending || status === "completed"}
          >
            Completed
          </button>
          <button
            onClick={() => handleChangeStatus("cancelled")}
            className="w-full text-left text-red-600 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
            disabled={isPending || status === "cancelled"}
          >
            Cancelled
          </button>
        </div>
      )}
    </div>
  );
}
