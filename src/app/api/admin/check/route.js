import { NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function GET() {
  const isAdmin = await verifySession();
  return NextResponse.json({ authenticated: isAdmin });
}
