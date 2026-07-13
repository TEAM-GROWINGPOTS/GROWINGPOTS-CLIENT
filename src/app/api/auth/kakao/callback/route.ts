import { type NextRequest, NextResponse } from 'next/server';

interface KakaoTokenResponse {
  access_token: string;
}

interface LoginData {
  accessToken: string;
  onboardingCompleted: boolean;
  nickname: string;
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
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
        redirect_uri: `${origin}/api/auth/kakao/callback`,
        code,
      }),
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('[kakao callback] 카카오 토큰 교환 실패', tokenRes.status, errBody);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { access_token: oauthAccessToken } = (await tokenRes.json()) as KakaoTokenResponse;

    const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/oauth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'KAKAO', oauthAccessToken }),
    });

    if (!loginRes.ok) {
      const errBody = await loginRes.text();
      console.error('[kakao callback] 서버 로그인 API 실패', loginRes.status, errBody);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data } = (await loginRes.json()) as LoginResponse;
    const redirectPath = data.onboardingCompleted ? state || '/' : '/onboarding';

    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    response.cookies.set('accessToken', data.accessToken, {
      path: '/',
      maxAge: 1800,
      sameSite: 'lax',
      httpOnly: false,
    });
    response.cookies.set('nickname', data.nickname, {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    });
    response.cookies.set('onboardingCompleted', String(data.onboardingCompleted), {
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (e) {
    console.error('[kakao callback] 예외 발생', e);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
