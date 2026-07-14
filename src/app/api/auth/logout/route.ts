import { type NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get('redirect') ?? '/login';
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', redirectTo === '/login' ? '' : redirectTo);
  const response = NextResponse.redirect(loginUrl);

  response.headers.append('Set-Cookie', `accessToken=; Path=/; Max-Age=0; SameSite=Lax`);
  response.headers.append('Set-Cookie', `accessToken=; Path=/api; Max-Age=0; SameSite=Lax`);
  response.headers.append('Set-Cookie', `refreshToken=; Path=/; Max-Age=0; SameSite=Lax`);
  response.headers.append('Set-Cookie', `refreshToken=; Path=/api/v1/auth/reissue; Max-Age=0; SameSite=Lax`);
  response.headers.append('Set-Cookie', `nickname=; Path=/; Max-Age=0; SameSite=Lax`);
  response.headers.append('Set-Cookie', `onboardingCompleted=; Path=/; Max-Age=0; SameSite=Lax`);

  return response;
}
