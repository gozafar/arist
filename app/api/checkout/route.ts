import { NextResponse } from "next/server";
import { CartStore } from "@/lib/server/cartStore";

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
  const { shipping } = (await req.json()) as { shipping?: Record<string, unknown> };
  if (!shipping) {
    return NextResponse.json({ message: "shipping required" }, { status: 400 });
  }
  const cart = await CartStore.get();
  const orderId = `order_${Date.now()}`;
  return NextResponse.json({ orderId, amount: cart.subtotal }, { status: 200 });
};
