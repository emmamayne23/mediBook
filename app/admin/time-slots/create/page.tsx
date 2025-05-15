"use client"

import { useState, useEffect } from "react"
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold">Create Time Slot</h2>

      <div>
        <label className="block text-sm font-medium">Doctor</label>
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          name="doctorId"
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Start Time</label>
        <input
          type="time"
          name="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">End Time</label>
        <input
          type="time"
          name="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Save Slot
      </button>
    </form>
  )
}
