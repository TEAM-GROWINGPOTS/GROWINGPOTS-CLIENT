import { type NextRequest, NextResponse } from 'next/server';

function fetchWithTimeout(url: string, init: RequestInit, ms = 10_000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(id));
}

interface KakaoTokenResponse {
  access_token: string;
}

interface LoginData {
  onboardingCompleted: boolean;
  nickname: string;
}

interface LoginResponse {
  data: LoginData;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const rawState = searchParams.get('state') ?? '';
  const state = rawState.startsWith('/') && !rawState.startsWith('//') ? rawState : '/';

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const kakaoClientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  if (!kakaoClientId) {
    console.error('[kakao callback] NEXT_PUBLIC_KAKAO_CLIENT_ID가 정의되지 않았습니다');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const tokenRes = await fetchWithTimeout('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: kakaoClientId,
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

    const loginRes = await fetchWithTimeout(`${process.env.API_BASE_URL}/api/v1/auth/oauth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'KAKAO', oauthAccessToken }),
      cache: 'no-store',
    });

    if (!loginRes.ok) {
      const errBody = await loginRes.text();
      console.error('[kakao callback] 서버 로그인 API 실패', loginRes.status, errBody);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data } = (await loginRes.json()) as LoginResponse;
    const redirectPath = data.onboardingCompleted ? state || '/' : '/onboarding';

    const response = NextResponse.redirect(new URL(redirectPath, request.url));

    // 서버가 Set-Cookie로 내려준 HttpOnly accessToken/refreshToken을 브라우저로 포워딩
    const loginResHeaders = loginRes.headers as Headers & { getSetCookie?: () => string[] };
    const hasGetSetCookie = typeof loginResHeaders.getSetCookie === 'function';
    const setCookies = hasGetSetCookie
      ? loginResHeaders.getSetCookie!()
      : (loginRes.headers.get('set-cookie') ?? '').split(/,(?=\s*\w+=)/).filter(Boolean);

    const isLocalhost = request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1';
    for (const cookie of setCookies) {
      const adjusted = isLocalhost
        ? cookie
            .trim()
            .replace(/;\s*Secure/gi, '')
            .replace(/SameSite=None/gi, 'SameSite=Lax')
        : cookie.trim();
      response.headers.append('Set-Cookie', adjusted);
    }

    const maxAge = 60 * 60 * 24 * 15;
    response.headers.append(
      'Set-Cookie',
      `nickname=${encodeURIComponent(data.nickname)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
    );
    response.headers.append(
      'Set-Cookie',
      `onboardingCompleted=${data.onboardingCompleted}; Path=/; Max-Age=${maxAge}; SameSite=Lax`,
    );

    return response;
  } catch (e) {
    console.error('[kakao callback] 예외 발생', e);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
