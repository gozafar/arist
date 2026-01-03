import { NextResponse } from 'next/server';
import { CartStore } from '@/lib/server/cartStore';

export const dynamic = 'force-dynamic';

export const POST = async () => {
  await CartStore.clear();
  return NextResponse.json({ status: 'succeeded' });
};
