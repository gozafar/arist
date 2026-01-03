import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { verifyAccessToken } from '@/lib/jwt';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  const token = req.cookies.get('access_token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const payload = verifyAccessToken(token);
    await dbConnect();
    const user = await User.findById(payload.userId);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ user: user.toJSON() });
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
};
