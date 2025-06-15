import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function
export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  const token = request.cookies.get('next-auth.session-token') || 
                request.cookies.get('__Secure-next-auth.session-token'); // For secure cookies on production

  // If the user is already authenticated and tries to access auth routes
  if (token && (
    url.pathname === '/sign-in' ||
    url.pathname === '/sign-up' ||
    url.pathname === '/verify'
  )) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is not authenticated and tries to access protected routes
  if (!token && (
    url.pathname.startsWith('/dashboard') ||
    url.pathname === '/'
  )) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
   
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
    
  ],
  
};
