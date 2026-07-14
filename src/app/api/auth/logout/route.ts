import { type NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));

  const cookieOptions = 'Path=/; Max-Age=0; SameSite=Lax';
  response.headers.append('Set-Cookie', `accessToken=; ${cookieOptions}`);
  response.headers.append('Set-Cookie', `refreshToken=; ${cookieOptions}`);
  response.headers.append('Set-Cookie', `nickname=; ${cookieOptions}`);
  response.headers.append('Set-Cookie', `onboardingCompleted=; ${cookieOptions}; HttpOnly`);

  return response;
}
