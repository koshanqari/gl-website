import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing intellsys routes
  if (pathname.startsWith('/intellsys')) {
    // Check if user is authenticated
    const isAuthenticated = request.cookies.get('admin-authenticated');

    // Allow login page
    if (pathname === '/intellsys/login') {
      return NextResponse.next();
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/intellsys/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/intellsys/:path*',
};

