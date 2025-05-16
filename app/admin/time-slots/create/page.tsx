"use client"

import { useState, useEffect } from "react"
import { FaClock, FaCalendarAlt, FaChevronDown, FaSave } from "react-icons/fa";
// import { handleAddTimeSlot } from "@/lib/actions"
// import { db } from "@/db/drizzle"
// import { eq } from "drizzle-orm"
// import { doctorProfiles, users } from "@/db/schema"

type Doctor = {
    id: string,
    name: string
}

export default function TimeSlotForm() {

    // const doctors = await db
    //   .select({ id: doctorProfiles.id, name: users.name })
    //   .from(doctorProfiles)
    //   .leftJoin(users, eq(doctorProfiles.userId, users.id))
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorId, setDoctorId] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")

  useEffect(() => {
    async function fetchDoctors() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`)
      const data = await res.json()
      setDoctors(data)
    }

    fetchDoctors()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/time-slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId,
        date,
        startTime,
        endTime,
      }),
    })

    const result = await res.json()
    console.log(result)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 space-y-6">
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
      <FaClock className="text-blue-500" />
      Create Time Slot
    </h2>
    <p className="text-gray-600 dark:text-gray-400 mt-1">
      Add available time slots for appointments
    </p>
  </div>

  {/* Doctor Selection */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Doctor <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <select
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        name="doctorId"
        className="block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-gray-800 dark:text-white"
        required
      >
        <option value="">Select a doctor</option>
        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            Dr. {doctor.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 dark:text-gray-300">
        <FaChevronDown className="text-sm" />
      </div>
    </div>
  </div>

  {/* Date Selection */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      Date <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type="date"
        name="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white"
        required
      />
      <FaCalendarAlt className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500" />
    </div>
  </div>

  {/* Time Range */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Start Time <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="time"
          name="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white"
          required
        />
        <FaClock className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        End Time <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <input
          type="time"
          name="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="block w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white"
          required
        />
        <FaClock className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
  >
    <FaSave />
    Save Time Slot
  </button>
</form>
  )
}
