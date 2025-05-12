
import { db } from '@/db/drizzle';
import { reviews } from '@/db/schema';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const record = await db.select().from(reviews).where(eq(reviews.id, params.id));
  return record[0] ? NextResponse.json(record[0]) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await db.delete(reviews).where(eq(reviews.id, params.id));
  return NextResponse.json({ success: true });
}
