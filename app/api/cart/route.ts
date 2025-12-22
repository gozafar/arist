import { NextResponse } from "next/server";
import { CartStore } from "@/lib/server/cartStore";
import Painting from "@/models/Painting";
import { dbConnect } from "@/lib/db";

export const dynamic = "force-dynamic";

export const GET = async () => {
  return NextResponse.json(await CartStore.get(), { status: 200 });
};

export const POST = async (req: Request) => {
  const { paintingId, quantity } = (await req.json()) as { paintingId?: string; quantity?: number };
  if (!paintingId) {
    return NextResponse.json({ message: "paintingId required" }, { status: 400 });
  }
  await dbConnect();
  const paintingCheck = await Painting.findById(paintingId).lean();
  if (!paintingCheck || Array.isArray(paintingCheck)) {
    return NextResponse.json({ message: "Painting not found" }, { status: 404 });
  }
  if ((paintingCheck as { availability?: string }).availability === "sold") {
    return NextResponse.json({ message: "Painting sold" }, { status: 400 });
  }
  const result = await CartStore.add(paintingId, quantity ?? 1);
  return NextResponse.json(result, { status: 200 });
};

export const DELETE = async () => {
  return NextResponse.json(await CartStore.clear(), { status: 200 });
};
