import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/lib/jwt';
import { setAuthCookies } from '@/lib/server/authCookies';

export const dynamic = 'force-dynamic';

export const POST = async (req: NextRequest) => {
  const token = req.cookies.get('refresh_token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const payload = verifyRefreshToken(token);
    await dbConnect();
    const user = await User.findById(payload.userId);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const access = signAccessToken({ userId: user.id, role: user.role });
    const refresh = signRefreshToken({ userId: user.id, role: user.role });
    const res = NextResponse.json({ user: user.toJSON() });
    setAuthCookies(res, access, refresh);
    return res;
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
};
