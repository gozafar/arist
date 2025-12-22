import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { dbConnect } from "@/lib/db";
import Painting from "@/models/Painting";
import AdminLog from "@/models/AdminLog";
import { requireRole } from "@/lib/rbac";
import { verifyAccessToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const authError = await requireRole(req, ["ADMIN", "SUPER_ADMIN"]);
  if (authError) return authError;

  await dbConnect();
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "50");
  const availability = searchParams.get("availability") || undefined;

  const query = availability ? { availability } : {};
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Painting.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Painting.countDocuments(query)
  ]);

  return NextResponse.json({
    items: items.map(({ _id, ...rest }) => ({ ...rest, id: _id?.toString() })),
    total,
    page,
    pageSize: limit
  });
};

export const POST = async (req: NextRequest) => {
  const authError = await requireRole(req, ["ADMIN", "SUPER_ADMIN"]);
  if (authError) return authError;

  await dbConnect();
  const payload = (await req.json()) as {
    title: string;
    description: string;
    price: number;
    medium: string;
    size: string;
    year: number;
    availability: "in-stock" | "sold";
    image: string;
    tags: string[];
    id?: string;
  };

  const token = req.cookies.get("access_token")?.value;
  const user = token ? verifyAccessToken(token) : null;
  const _id = payload.id || payload.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(16);
  const created = await Painting.create({ ...payload, _id });
  if (user) await AdminLog.create({ adminId: user.userId, action: "CREATE_PAINTING", targetId: created._id });
  revalidateTag("paintings", "default");
  return NextResponse.json(created.toJSON(), { status: 201 });
};
