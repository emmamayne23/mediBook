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
        return NextResponse.json(newSlot[0], { status: 201 });
    } catch (error) {
        console.error('Error creating time slot:', error);
        return NextResponse.json(
            { error: 'Failed to create time slot' },
            { status: 500 }
        );
    }
}