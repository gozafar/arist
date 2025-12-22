import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { dbConnect } from "@/lib/db";
import Painting from "@/models/Painting";
import AdminLog from "@/models/AdminLog";
import { requireRole } from "@/lib/rbac";
import { verifyAccessToken } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export const PATCH = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const authError = await requireRole(req, ["ADMIN", "SUPER_ADMIN"]);
  if (authError) return authError;

  await dbConnect();
  const payload = (await req.json()) as Record<string, unknown>;
  const updated = await Painting.findByIdAndUpdate(id, payload, { new: true }).lean();
  if (!updated || Array.isArray(updated)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const token = req.cookies.get("access_token")?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (user) await AdminLog.create({ adminId: user.userId, action: "UPDATE_PAINTING", targetId: id });
  revalidateTag("paintings", "default");
  const { _id, ...rest } = updated;
  return NextResponse.json({ ...rest, id: _id?.toString?.() || id });
};

export const DELETE = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
  const authError = await requireRole(req, ["ADMIN", "SUPER_ADMIN"]);
  if (authError) return authError;

  await dbConnect();
  const removed = await Painting.findByIdAndDelete(id);
  if (!removed) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const token = req.cookies.get("access_token")?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (user) await AdminLog.create({ adminId: user.userId, action: "DELETE_PAINTING", targetId: id });
  revalidateTag("paintings", "default");
  return NextResponse.json({ status: "ok" });
};
