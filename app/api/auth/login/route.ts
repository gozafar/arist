import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { hashPassword, verifyPassword } from '@/lib/password';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';
import { setAuthCookies } from '@/lib/server/authCookies';

export const dynamic = 'force-dynamic';

export const POST = async (req: Request) => {
  const { email, password, code } = (await req.json()) as { email?: string; password?: string; code?: string };

  await dbConnect();

  // Legacy admin code support for existing UI
  if (code) {
    if (code.trim().toLowerCase() !== (process.env.ADMIN_CODE || 'artist')) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const adminEmail = 'admin@example.com';
    const adminName = 'Admin';
    const passwordHash = await verifyOrSeedAdmin(adminEmail, adminName);
    const access = signAccessToken({ userId: passwordHash.id, role: passwordHash.role });
    const refresh = signRefreshToken({ userId: passwordHash.id, role: passwordHash.role });
    const res = NextResponse.json({ user: passwordHash });
    setAuthCookies(res, access, refresh);
    return res;
  }

  if (!email || !password) {
    return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
  }

  // Ensure default admin exists if matching configured credentials
  const defaultAdminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@example.com';
  const defaultAdminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'password';
  if (email.toLowerCase() === defaultAdminEmail.toLowerCase()) {
    let admin = await User.findOne({ email: defaultAdminEmail.toLowerCase() });
    if (!admin) {
      const hashed = await hashPassword(defaultAdminPassword);
      admin = await User.create({
        name: 'Admin',
        email: defaultAdminEmail.toLowerCase(),
        password: hashed,
        role: 'ADMIN',
      });
    }
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const access = signAccessToken({ userId: user.id, role: user.role });
  const refresh = signRefreshToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({ user: user.toJSON() });
  setAuthCookies(res, access, refresh);
  return res;
};

const verifyOrSeedAdmin = async (email: string, name: string) => {
  const existing = await User.findOne({ email });
  if (existing) return existing.toJSON();
  const defaultHash = '$2a$10$2b22X0bN6zy5ruvSkf2CVeeEIxzsuE8m5mEM2GtR3hfbRv6KOOwN2'; // hash for "password"
  const created = await User.create({
    name,
    email,
    password: defaultHash,
    role: 'ADMIN',
  });
  return created.toJSON();
};
