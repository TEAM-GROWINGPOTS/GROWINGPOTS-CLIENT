import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const accessToken = request.cookies.get('accessToken')?.value;
  const onboardingCompleted = request.cookies.get('onboardingCompleted')?.value;

  if (!isPublic && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (accessToken && onboardingCompleted !== 'true' && !isPublic && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (isPublic && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp).*)'],
};
