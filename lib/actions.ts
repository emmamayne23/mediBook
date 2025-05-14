"use server"

import { db } from "@/db/drizzle";
import { timeAvailabilitySlots, users, doctorProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";


import { signIn } from "@/auth";
import { revalidatePath } from "next/cache";

export async function handleSignUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, password })
  });
  
  const data = await response.json();
  
  if(!response.ok) {
    console.error(data.error || "Sign up failed");
    return;
  }
  
  await signIn("credentials", { email, password, redirectTo: "/" });
  console.log("Authentication failed without redirect");

  revalidatePath("/");
}

 export async function handleSignin(formData: FormData) {

    const email = formData.get("email") as string
    const password = formData.get("password") as string
      // 1st option
      // await signIn("credentials", { email, password, redirectTo: "/" })

      // 2nd option
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if(!response.ok) {
        console.error(data.error || "Sign in failed");
        return;
      }
      await signIn("credentials", { email, password, redirectTo: "/" })
      console.log("Authentication failed without redirect")

      revalidatePath("/");
  }


export async function handleGoogleSignIn() {
  await signIn("google", { redirectTo: "/" });
}

export async function handleAddTimeSlot(formData: FormData) {
  const doctorId = formData.get("doctorId") as string
  const date = formData.get("date") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string

  await db.insert(timeAvailabilitySlots).values({ doctorId, date, startTime, endTime })

  // revalidatePath("/");
}


export async function updateUserRole(formData: FormData) {
  const userId = formData.get("userId") as string
  const newRole = formData.get("role") as string

  if (!["patient", "doctor", "admin", "receptionist"].includes(newRole)) return

  await db.update(users).set({ role: newRole as "patient" | "doctor" | "admin" | "receptionist" }).where(eq(users.id, userId))

  revalidatePath("/admin/manage-users")
}

export async function updateDoctorProfile(formData: FormData) {
  const doctorId = formData.get("doctorId") as string
  const bio = formData.get("bio") as string
  const qualifications = formData.get("qualifications") as string
  const yearsExperience = Number(formData.get("yearsExperience"))

  await db.update(doctorProfiles).set({ bio, qualifications, yearsExperience }).where(eq(doctorProfiles.userId, doctorId))
}