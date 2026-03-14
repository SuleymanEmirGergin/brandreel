import { NextResponse } from 'next/server';
import { mockBundle } from '@/lib/mock-data';

export async function POST() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return NextResponse.json(mockBundle);
}
