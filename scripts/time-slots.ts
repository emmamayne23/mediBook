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
