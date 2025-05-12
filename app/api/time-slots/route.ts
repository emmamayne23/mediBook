import { db } from '@/db/drizzle';
import { timeAvailabilitySlots } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  const all = await db.select().from(timeAvailabilitySlots);
  return NextResponse.json(all);
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const newSlot = await db.insert(timeAvailabilitySlots).values(body).returning()
        return NextResponse.json(newSlot);
    } catch (error) {
        console.error('Error fetching time slots:', error);
        return NextResponse.json(
            { error: 'Failed to fetch time slots' },
            { status: 500 }
        );
    }
}