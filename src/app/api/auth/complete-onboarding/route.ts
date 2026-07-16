import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const backendRes = await fetch(`${process.env.API_BASE_URL}/api/v1/students/me/onboarding-confirm`, {
    method: 'PATCH',
    headers: { Cookie: request.headers.get('cookie') ?? '' },
    cache: 'no-store',
  });

  const body = await backendRes.text();

  const response = new NextResponse(body, {
    status: backendRes.status,
    headers: { 'Content-Type': 'application/json' },
  });

  const backendResHeaders = backendRes.headers as Headers & { getSetCookie?: () => string[] };
  const hasGetSetCookie = typeof backendResHeaders.getSetCookie === 'function';
  const setCookies = hasGetSetCookie
    ? backendResHeaders.getSetCookie!()
    : (backendRes.headers.get('set-cookie') ?? '').split(/,(?=\s*\w+=)/).filter(Boolean);

  setCookies.forEach((cookie) => response.headers.append('Set-Cookie', cookie));

  if (!backendRes.ok) {
    return response;
  }

  const maxAge = 60 * 60 * 24 * 15;
  response.headers.append('Set-Cookie', `onboardingCompleted=true; Path=/; Max-Age=${maxAge}; SameSite=Lax`);
  return response;
}
