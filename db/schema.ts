import { varchar, uuid, timestamp, pgTable, text, integer, boolean, date, time } from "drizzle-orm/pg-core";

// users
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull().unique(),
    profileImage: varchar("profile_image", { length: 255 }),
    passwordHash: varchar("password_hash", { length: 255 }),
    role: varchar("role", {
         enum: ["patient", "doctor", "admin", "receptionist"] 
        }).default("patient"),
    createdAt: timestamp("created_at").defaultNow()
})

// specialties
export const specialties = pgTable("specialties", {
    id: uuid("id").primaryKey().defaultRandom(),
    specialty: varchar("specialty", { length: 100 }).notNull(),
    description: text("description"),
    icon_url: varchar("icon_url")
})

// doctors profile
export const doctorProfiles = pgTable("doctor_profiles", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    specialtyId: uuid("specialty_id").notNull().references(() => specialties.id),
    bio: text("bio"),
    qualifications: text("qualifications"),
    yearsExperience: integer("years_experience"),
    imageUrl: varchar("image_url"),
    available: boolean("available").default(true)
})

//  time availability slots
export const timeAvailabilitySlots = pgTable("time_availability_slots", {
    id: uuid("id").primaryKey().defaultRandom(),
    doctorId: uuid("doctor_id").notNull().references(() => doctorProfiles.id),
    date: date("date").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    isBooked: boolean("is_booked").default(false)
})

// appointments
export const appointments = pgTable("appointments", {
    id: uuid("id").primaryKey().defaultRandom(),
    patientId: uuid("patient_id").notNull().references(() => users.id),
    doctorId: uuid("doctor_id").notNull().references(() => doctorProfiles.id),
    slotId: uuid("slot_id").notNull().references(() => timeAvailabilitySlots.id),
    status: varchar("status", {
        enum: ["confirmed", "cancelled", "completed"]
    }).default("confirmed"),
    createdAt: timestamp("created_at").defaultNow()
})

// reviews
export const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey().defaultRandom(),
    patientId: uuid("patient_id").notNull().references(() => users.id),
    doctorId: uuid("doctor_id").notNull().references(() => doctorProfiles.id),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow()
})

// manual bookings
export const manualBookings = pgTable("manual_bookings", {
    id: uuid("id").primaryKey().defaultRandom(),
    receptionistId: uuid("receptionist_id").notNull().references(() => users.id),
    patientName: varchar("patient_name", { length: 255 }),
    contactInfo: varchar("contact_info", { length: 255 }),
    doctorId: uuid("doctor_id").notNull().references(() => doctorProfiles.id),
    slotId: uuid("slot_id").notNull().references(() => timeAvailabilitySlots.id),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow()
})