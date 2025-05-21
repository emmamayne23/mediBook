import "dotenv/config";
import { db } from "@/db/drizzle";
import { timeAvailabilitySlots, doctorProfiles } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { addMinutes, format, setHours, setMinutes, getDay } from "date-fns";

// 🧹 Delete only slots that aren't linked to appointments
async function clearExistingTimeSlots() {
  await db.execute(sql`
    DELETE FROM ${timeAvailabilitySlots}
    WHERE id NOT IN (
      SELECT slot_id FROM appointments WHERE slot_id IS NOT NULL
    )
  `);

  console.log("✅ Cleared unbooked time slots.");
}

// 🕐 Generate slots based on your rules
async function seedTimeSlotsForAllDoctors(startDate: string, endDate: string) {
  await clearExistingTimeSlots();

  const start = new Date(startDate);
  const end = new Date(endDate);
  const slotInterval = 30;

  const allDoctors = await db.select().from(doctorProfiles);

  for (const doctor of allDoctors) {
    const current = new Date(start);

    while (current <= end) {
      const day = getDay(current); 
      let slotStartHour = 9;
      let slotEndHour = 17;

      if (day === 0) {
        current.setDate(current.getDate() + 1);
        continue; // Skip Sundays
      }

      if (day === 6) {
        // Saturday: 10 AM to 2 PM
        slotStartHour = 10;
        slotEndHour = 14;
      }

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

    console.log(`✅ Time slots seeded for doctorId: ${doctor.id}`);
  }

  console.log(`🎉 All time slots seeded from ${startDate} to ${endDate}`);
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
    console.error("🔥 Error seeding time slots:", err);
    process.exit(1);
  });


// CLI usage: tsx scripts/seedTimeSlots.ts <startDate> <endDate>
// npm run drizzle:time-slot 2025-05-21 2025-06-21

