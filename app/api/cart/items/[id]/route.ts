import { NextRequest, NextResponse } from 'next/server';
import { CartStore } from '@/lib/server/cartStore';

export const dynamic = 'force-dynamic';

export const PATCH = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const { quantity } = (await req.json()) as { quantity?: number };
  if (!quantity || quantity < 1) {
    return NextResponse.json({ message: 'quantity must be at least 1' }, { status: 400 });
  }
  const result = await CartStore.update(id, quantity);
  return NextResponse.json(result, { status: 200 });
};

export const DELETE = async (_req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const result = await CartStore.remove(id);
  return NextResponse.json(result, { status: 200 });
};
