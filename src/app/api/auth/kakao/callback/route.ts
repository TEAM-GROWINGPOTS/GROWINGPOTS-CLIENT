import { type NextRequest, NextResponse } from 'next/server';

interface KakaoTokenResponse {
  access_token: string;
}

interface LoginData {
  accessToken: string;
  onboardingCompleted: boolean;
}

interface LoginResponse {
  data: LoginData;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state') ?? '';

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY!,
        redirect_uri: `${origin}/api/auth/kakao/callback`,
        code,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { access_token: oauthAccessToken } = (await tokenRes.json()) as KakaoTokenResponse;

    const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/oauth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'KAKAO', oauthAccessToken }),
    });

    if (!loginRes.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data } = (await loginRes.json()) as LoginResponse;
    const redirectPath = state || (data.onboardingCompleted ? '/' : '/onboarding');

    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    response.cookies.set('accessToken', data.accessToken, {
      path: '/',
      maxAge: 1800,
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
