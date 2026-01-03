import { NextResponse } from 'next/server';
import { clearAuthCookies } from '@/lib/server/authCookies';

export const dynamic = 'force-dynamic';

export const POST = () => {
  const res = NextResponse.json({ success: true });
  clearAuthCookies(res);
  return res;
};
