import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import { setAuthCookies } from "@/lib/server/authCookies";

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
  const { name, email, password } = (await req.json()) as { name?: string; email?: string; password?: string };
  if (!name || !email || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  await dbConnect();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ message: "Email already registered" }, { status: 409 });
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email: email.toLowerCase(), password: hashed, role: "USER" });

  const access = signAccessToken({ userId: user.id, role: user.role });
  const refresh = signRefreshToken({ userId: user.id, role: user.role });

  const res = NextResponse.json({ user: user.toJSON() });
  setAuthCookies(res, access, refresh);
  return res;
};
