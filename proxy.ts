import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/paintings",
  "/contact",
  "/api/paintings",
  "/api/contact",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh"
];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/_next") || pathname.startsWith("/static")) return NextResponse.next();

  const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAdminLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
  if (isPublic || isAdminLogin) return NextResponse.next();

  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const user = verifyAccessToken(token);
    if (pathname.startsWith("/admin") && !["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.redirect(new URL("/403", req.url));
    }
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"]
};
