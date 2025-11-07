import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/volunteer', '/admin'];

// Routes that require specific roles
const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['admin'],
  '/volunteer': ['volunteer', 'admin'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for session cookie (Appwrite sets this)
  const sessionCookie = request.cookies.get('a_session_' + (process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'ccf-animal-welfare'));

  if (!sessionCookie) {
    // Redirect to login if no session
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Note: Role-based access control is handled client-side in the AuthContext
  // For server-side role checking, you would need to verify the session with Appwrite
  // This is a basic implementation that checks for session existence

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/volunteer/:path*', '/admin/:path*'],
};
