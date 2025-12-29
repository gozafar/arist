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

  const { availability } = (await req.json()) as { availability?: "in-stock" | "sold" };
  if (!availability) {
    return NextResponse.json({ message: "Availability is required" }, { status: 400 });
  }
  await dbConnect();
  const updated = await Painting.findByIdAndUpdate(
    id,
    { availability },
    { new: true }
  ).lean();
  if (!updated || Array.isArray(updated)) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  const token = req.cookies.get("access_token")?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (user) await AdminLog.create({ adminId: user.userId, action: "TOGGLE_AVAILABILITY", targetId: id });
  revalidateTag("paintings", "default");
  const { _id, ...rest } = updated;
  return NextResponse.json({ ...rest, id: _id?.toString?.() || id });
};
