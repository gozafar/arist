import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, JwtRole } from "./jwt";

export const hasRole = (role: JwtRole, allowed: JwtRole[]) => allowed.includes(role);

export const getUserFromRequest = (req: NextRequest) => {
  const token = req.cookies.get("access_token")?.value;
  if (!token) return null;
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
};

export const requireRole = async (req: NextRequest, roles: JwtRole[]) => {
  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const payload = verifyAccessToken(token);
    if (!hasRole(payload.role, roles)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return null;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
};
