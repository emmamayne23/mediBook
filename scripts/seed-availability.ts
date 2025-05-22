// // scripts/seed-availability.ts

// import { db } from "@/db/drizzle"; // adjust this path if needed
// import { timeAvailabilitySlots, doctorProfiles } from "@/db/schema";
// import { addDays, format } from "date-fns";
// import { v4 as uuidv4 } from "uuid";

// async function seedAvailability() {
//   const doctors = await db.select().from(doctorProfiles).limit(3); // Change limit as needed

//   if (doctors.length === 0) {
//     console.log("❌ No doctor profiles found.");
//     return;
//   }

//   const slotsToInsert = [];

//   for (const doctor of doctors) {
//     for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
//       const date = format(addDays(new Date(), dayOffset), "yyyy-MM-dd");

//       for (let hour = 9; hour < 17; hour++) {
//         const startTime = `${hour.toString().padStart(2, "0")}:00`;
//         const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

//         slotsToInsert.push({
//           id: uuidv4(),
//           doctorId: doctor.id,
//           date,
//           startTime,
//           endTime,
//           isBooked: false,
//         });
//       }
//     }
//   }

//   await db.insert(timeAvailabilitySlots).values(slotsToInsert);
//   console.log(`✅ Seeded ${slotsToInsert.length} availability slots.`);
// }

// seedAvailability().catch((err) => {
//   console.error("❌ Error seeding slots:", err);
// });

// import { db } from '@/db/drizzle';
// import { timeAvailabilitySlots, doctorProfiles } from '@/db/schema';
// import { v4 as uuidv4 } from 'uuid';
// import { addDays, format } from 'date-fns';

// export async function seedTimeAvailabilitySlots() {
//   // First, get all doctor IDs from the doctor_profiles table
//   const doctors = await db.select({ id: doctorProfiles.id }).from(doctorProfiles);
  
//   if (doctors.length === 0) {
//     console.log('No doctors found. Please seed doctor profiles first.');
//     return;
//   }

//   // Create availability slots for the next 14 days
//   const slots = [];
//   const today = new Date();
  
//   // For each doctor
//   for (const doctor of doctors) {
//     // For the next 14 days
//     for (let i = 0; i < 14; i++) {
//       const currentDate = addDays(today, i);
//       const formattedDate = format(currentDate, 'yyyy-MM-dd');
      
//       // Skip weekends (Saturday and Sunday)
//       const dayOfWeek = currentDate.getDay();
//       if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
//       // Create 8 slots per day (9 AM to 5 PM, 1 hour each)
//       for (let hour = 9; hour < 17; hour++) {
//         slots.push({
//           id: uuidv4(),
//           doctorId: doctor.id,
//           date: formattedDate,
//           startTime: `${hour}:00:00`,
//           endTime: `${hour + 1}:00:00`,
//           isBooked: false
//         });
//       }
//     }
//   }

//   // Insert the slots in batches to avoid overwhelming the database
//   const batchSize = 100;
//   for (let i = 0; i < slots.length; i += batchSize) {
//     const batch = slots.slice(i, i + batchSize);
//     await db.insert(timeAvailabilitySlots).values(batch);
//   }

//   console.log(`Seeded ${slots.length} time availability slots for ${doctors.length} doctors.`);
// }

import "dotenv/config";
import { db } from "@/db/drizzle";
import { timeAvailabilitySlots, doctorProfiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { addMinutes, format, setHours, setMinutes } from "date-fns";

async function seedTimeSlotsForAllDoctors(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const slotStartHour = 9;
  const slotEndHour = 17;
  const slotInterval = 30; // minutes

  const allDoctors = await db.select().from(doctorProfiles);

  for (const doctor of allDoctors) {
    const current = new Date(start);

    while (current <= end) {
      const dateStr = format(current, "yyyy-MM-dd");

      for (let hour = slotStartHour; hour < slotEndHour; hour++) {
        for (let min = 0; min < 60; min += slotInterval) {
          const startTime = setMinutes(setHours(current, hour), min);
          const endTime = addMinutes(startTime, slotInterval);

          const startFormatted = format(startTime, "HH:mm:ss");
          const endFormatted = format(endTime, "HH:mm:ss");

          const existing = await db.select()
            .from(timeAvailabilitySlots)
            .where(and(
              eq(timeAvailabilitySlots.doctorId, doctor.id),
              eq(timeAvailabilitySlots.date, dateStr),
              eq(timeAvailabilitySlots.startTime, startFormatted),
              eq(timeAvailabilitySlots.endTime, endFormatted),
            ))
            .limit(1);

          if (existing.length === 0) {
            await db.insert(timeAvailabilitySlots).values({
              doctorId: doctor.id,
              date: dateStr,
              startTime: startFormatted,
              endTime: endFormatted,
            });
          }
        }
      }

      current.setDate(current.getDate() + 1);
    }

    console.log(`Time slots seeded for doctorId: ${doctor.id}`);
  }

  console.log(`All time slots seeded from ${startDate} to ${endDate}`);
}

// CLI usage: tsx scripts/seedTimeSlots.ts <startDate> <endDate>
const [,, startDate, endDate] = process.argv;

if (!startDate || !endDate) {
  console.error("Usage: tsx scripts/seedTimeSlots.ts <startDate> <endDate>");
  process.exit(1);
}

seedTimeSlotsForAllDoctors(startDate, endDate)
  .then(() => process.exit(0))
  .catch(err => {
    console.error("Error seeding time slots:", err);
    process.exit(1);
  });

