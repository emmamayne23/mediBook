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

import { db } from '@/db/drizzle';
import { timeAvailabilitySlots, doctorProfiles } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';

export async function seedTimeAvailabilitySlots() {
  // First, get all doctor IDs from the doctor_profiles table
  const doctors = await db.select({ id: doctorProfiles.id }).from(doctorProfiles);
  
  if (doctors.length === 0) {
    console.log('No doctors found. Please seed doctor profiles first.');
    return;
  }

  // Create availability slots for the next 14 days
  const slots = [];
  const today = new Date();
  
  // For each doctor
  for (const doctor of doctors) {
    // For the next 14 days
    for (let i = 0; i < 14; i++) {
      const currentDate = addDays(today, i);
      const formattedDate = format(currentDate, 'yyyy-MM-dd');
      
      // Skip weekends (Saturday and Sunday)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      // Create 8 slots per day (9 AM to 5 PM, 1 hour each)
      for (let hour = 9; hour < 17; hour++) {
        slots.push({
          id: uuidv4(),
          doctorId: doctor.id,
          date: formattedDate,
          startTime: `${hour}:00:00`,
          endTime: `${hour + 1}:00:00`,
          isBooked: false
        });
      }
    }
  }

  // Insert the slots in batches to avoid overwhelming the database
  const batchSize = 100;
  for (let i = 0; i < slots.length; i += batchSize) {
    const batch = slots.slice(i, i + batchSize);
    await db.insert(timeAvailabilitySlots).values(batch);
  }

  console.log(`Seeded ${slots.length} time availability slots for ${doctors.length} doctors.`);
}
