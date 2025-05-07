import "dotenv/config";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import {
  users,
  specialties,
  doctorProfiles,
  appointments,
  timeAvailabilitySlots
} from "@/db/schema";

async function seed() {
  console.log("🌱 Starting seed...");

  // Seed users
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        name: "Dr. Jane Doe",
        email: "jane@example.com",
        passwordHash: "hashed_password_1",
        role: "doctor",
      },
      {
        name: "John Patient",
        email: "john@example.com",
        passwordHash: "hashed_password_2",
        role: "patient",
      },
    ])
    .returning();

  console.log("✅ Users seeded");

  // Seed specialties
  const insertedSpecialties = await db
    .insert(specialties)
    .values([
      {
        specialty: "Cardiology",
        description: "Heart specialist",
        icon_url: "❤️",
      },
      {
        specialty: "Dermatology",
        description: "Skin specialist",
        icon_url: "🧴",
      },
    ])
    .returning();

  console.log("✅ Specialties seeded");

  // Seed doctor profile
  const doctorUser = insertedUsers.find((u) => u.role === "doctor");
  const specialty = insertedSpecialties[0];

  if (doctorUser && specialty) {
    await db.insert(doctorProfiles).values({
      userId: doctorUser.id,
      specialtyId: specialty.id,
      bio: "Experienced heart surgeon.",
      qualifications: "MBBS, MD",
      yearsExperience: 10,
      imageUrl: "https://example.com/doctor.jpg",
    });

    console.log("✅ Doctor profile seeded");
  }

  // Seed time slots for the doctor
if (doctorUser) {
    const today = new Date();
    const slots = [
      {
        doctorId: doctorUser.id,
        date: today.toISOString().split("T")[0],
        startTime: "09:00:00",
        endTime: "09:30:00",
      },
      {
        doctorId: doctorUser.id,
        date: today.toISOString().split("T")[0],
        startTime: "10:00:00",
        endTime: "10:30:00",
      },
    ];
  
    await db.insert(timeAvailabilitySlots).values(slots);
    console.log("✅ Time availability slots seeded");
  }

  // Seed appointment
const patientUser = insertedUsers.find((u) => u.role === "patient");
const slot = await db
  .select()
  .from(timeAvailabilitySlots)
  .where(eq(timeAvailabilitySlots.doctorId, doctorUser!.id));

if (doctorUser && patientUser && slot.length > 0) {
  await db.insert(appointments).values({
    patientId: patientUser.id,
    doctorId: doctorUser.id,
    slotId: slot[0].id,
    status: "confirmed",
  });

  console.log("✅ Appointment seeded");
}

  console.log("🌱 Seed finished.");
}

seed().catch((err) => {
  console.error("❌ Seed failed", err);
  process.exit(1);
});
