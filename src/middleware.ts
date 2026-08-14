import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode('siv-crm-secret-key-2024-secure');

// Routes that don't require authentication
const publicPaths = ['/crm/login', '/crm/api/auth'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and API auth routes
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Only protect /crm/* routes
  if (!pathname.startsWith('/crm')) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get('crm-token')?.value;

  if (!token) {
    const loginUrl = new URL('/crm/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify JWT token
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token invalid or expired
    const loginUrl = new URL('/crm/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    // Clear the invalid cookie
    response.cookies.set('crm-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });
    return response;
  }
}

export const config = {
  matcher: ['/crm/:path*'],
};
