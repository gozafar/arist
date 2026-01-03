import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/server/adminAuth';

export const GET = async () => {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    admin: { id: 'admin', email: 'admin@example.com' },
    token: 'admin-session',
  });
};
