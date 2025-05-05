import { varchar, uuid, timestamp, pgTable } from "drizzle-orm/pg-core";

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