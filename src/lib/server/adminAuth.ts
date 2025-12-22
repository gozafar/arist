import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ADMIN_TOKEN_COOKIE = "admin-token";
const DEFAULT_ADMIN_CODE = process.env.ADMIN_CODE || "artist";

export const isAuthenticated = async () => {
  const store = await cookies();
  const token = store.get(ADMIN_TOKEN_COOKIE);
  return Boolean(token);
};

export const validateAdminCode = (code: string) => code.trim().toLowerCase() === DEFAULT_ADMIN_CODE.toLowerCase();

export const setAdminSession = () => {
  const response = NextResponse.json({
    admin: {
      id: "admin",
      email: "admin@example.com"
    },
    token: "admin-session"
  });
  response.cookies.set({
    name: ADMIN_TOKEN_COOKIE,
    value: "admin-session",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
};

export const requireAdmin = async () => {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return null;
};
