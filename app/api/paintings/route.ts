import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Painting from "@/models/Painting";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "50");
  const availability = searchParams.get("availability") || undefined;

  await dbConnect();

  const query = availability ? { availability } : {};
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Painting.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Painting.countDocuments(query)
  ]);

  const serialized = items.map(({ _id, ...rest }) => ({
    ...rest,
    id: _id?.toString()
  }));

  return NextResponse.json(
    {
      items: serialized,
      total,
      page,
      pageSize: limit
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60"
      }
    }
  );
};
