import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';

const PUBLIC_PATHS = [
  '/',
  '/about',
  '/paintings',
  '/contact',
  '/api/paintings',
  '/api/contact',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/_next') || pathname.startsWith('/static')) return NextResponse.next();

  const isPublic = PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));
  const isAdminLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/');
  if (isPublic || isAdminLogin) return NextResponse.next();

  const token = req.cookies.get('access_token')?.value;
  // if (!token) {
  const refreshToken = req.cookies.get('refresh_token')?.value;

  if (!token && !refreshToken) {
    // No tokens at all - user is not logged in, redirect to login
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  if (!token && refreshToken) {
    // Access token expired but refresh token exists - let AdminGate handle refresh
    return NextResponse.next();
  }

  try {
    // const user = verifyAccessToken(token);
    const user = verifyAccessToken(token!);

    if (pathname.startsWith('/admin') && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return NextResponse.redirect(new URL('/403', req.url));
    }
    return NextResponse.next();
  } catch {
    //   if (pathname.startsWith("/admin")) {
    //   return NextResponse.redirect(new URL("/admin/login", req.url));
    // }
    // Don't redirect here - let AdminGate handle auth with refresh token
    // This allows refresh token to work before redirecting to login
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
