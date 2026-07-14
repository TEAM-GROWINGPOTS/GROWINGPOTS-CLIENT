import { type NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) return NextResponse.next();

  const onboardingCompleted = request.cookies.get('onboardingCompleted')?.value;
  const isLoggedIn = onboardingCompleted !== undefined;

  if (pathname === '/login') {
    return isLoggedIn ? NextResponse.redirect(new URL('/', request.url)) : NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (onboardingCompleted !== 'true' && pathname !== '/onboarding') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp).*)'],
};
