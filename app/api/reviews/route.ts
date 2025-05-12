
import { db } from '@/db/drizzle';
import { reviews } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allReviews = await db.select().from(reviews);
    return NextResponse.json(allReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await db.insert(reviews).values(data).returning();
  return NextResponse.json(created[0]);
}