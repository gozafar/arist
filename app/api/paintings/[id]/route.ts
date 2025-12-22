import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Painting from "@/models/Painting";

export const dynamic = "force-dynamic";

export const GET = async (_req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  await dbConnect();
  const painting = await Painting.findById(id).lean();
  if (!painting || Array.isArray(painting)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const { _id, ...rest } = painting;
  return NextResponse.json(
    { ...rest, id: _id?.toString?.() || id },
    {
      headers: {
        "Cache-Control": "public, max-age=60"
      }
    }
  );
};
