import { db } from '@/db/drizzle';
import { appointments } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const allAppointments = await db.select().from(appointments)
        return NextResponse.json(allAppointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch appointments' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const newAppointment = await db.insert(appointments).values(body).returning()
        return NextResponse.json(newAppointment[0], { status: 201 })
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json(
            { error: 'Failed to create appointment' },
            { status: 500 }
        );
    }
}