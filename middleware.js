import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to login page, API routes, Next.js internals, and public static assets
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.[^/]+$/)
  ) {
    return NextResponse.next();
  }

  // Check if user is logged in using cookie set by the login page.
  // Middleware runs on the server side, so we cannot access localStorage here.

  const loggedIn = request.cookies.get('loggedIn')?.value === 'true';

  if (!loggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
