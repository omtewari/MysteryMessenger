import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Middleware function
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If the user is already authenticated and tries to access auth-related routes (sign-in, sign-up, etc.), redirect them to the homepage
  if (token && (
    url.pathname === '/sign-in' ||
    url.pathname === '/sign-up' ||
    url.pathname === '/verify'
  )) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // If the user is not authenticated and tries to access protected pages, redirect them to the sign-in page
  if (!token && (
    url.pathname.startsWith('/dashboard') ||
    url.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Allow the request if none of the above conditions apply
  return NextResponse.next();
}

// Define which paths should be matched by the middleware
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
  ],
};
