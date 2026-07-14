import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  const maxAge = 60 * 60 * 24 * 15;
  response.headers.set('Set-Cookie', `onboardingCompleted=true; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly`);
  return response;
}
