import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    try {
        const profileUser = await db
          .select()
          .from(users)
          .where(eq(users.id, params.id))

        return NextResponse.json(profileUser[0])
    } catch (error) {
        console.error("Could not get profile", error)
        return NextResponse.json({ error: "Can't fetch profile" }, { status: 500 })
    }
}