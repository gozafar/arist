import { NextResponse } from 'next/server';
import { setAdminSession, validateAdminCode } from '@/lib/server/adminAuth';

export const POST = async (req: Request) => {
  const body = (await req.json()) as { code?: string; password?: string };
  const code = body.code || body.password;
  if (!code || !validateAdminCode(code)) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  return setAdminSession();
};
