import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (apiBase) {
    try {
      await fetch(`${apiBase}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Cookie: request.headers.get('cookie') ?? '' },
      });
    } catch {
      // 세션이 이미 만료됐거나 백엔드 오류 시 무시하고 로그아웃 진행
    }
  }

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
