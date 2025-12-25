import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { dbConnect } from "@/lib/db";
import Painting from "@/models/Painting";
import AdminLog from "@/models/AdminLog";
import { requireRole } from "@/lib/rbac";
import { verifyAccessToken } from "@/lib/jwt";
import fs from "fs";
import path from "path";
import { uploadOnCloudinary } from "../../cloudinary";
import mongoose from "mongoose";

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  url?: string;
  asset_id?: string;
  signature?: string;
  version?: number;
  format?: string;
  resource_type?: string;
  created_at?: string;
  tags?: string[];
  bytes?: number;
  width?: number;
  height?: number;
  etag?: string;
  placeholder?: boolean;
}

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

// export const POST = async (req: NextRequest) => {
//   const authError = await requireRole(req, ["ADMIN", "SUPER_ADMIN"]);
//   if (authError) return authError;

//   await dbConnect();
//   const payload = (await req.json()) as {
//     title: string;
//     description: string;
//     price: number;
//     medium: string;
//     size: string;
//     year: number;
//     availability: "in-stock" | "sold";
//     image: string;
//     tags: string[];
//     id?: string;
//   };

//   const token = req.cookies.get("access_token")?.value;
//   const user = token ? verifyAccessToken(token) : null;
//   const _id = payload.id || payload.title.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(16);
//   const created = await Painting.create({ ...payload, _id });
//   if (user) await AdminLog.create({ adminId: user.userId, action: "CREATE_PAINTING", targetId: created._id });
//   revalidateTag("paintings", "default");
//   return NextResponse.json(created.toJSON(), { status: 201 });
// };


export const POST = async (req: NextRequest) => {
  const authError = await requireRole(req, ["ADMIN", "SUPER_ADMIN"]);
  if (authError) return authError;

  await dbConnect();

  // Check if request is multipart/form-data
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.includes('multipart/form-data')) {
    return NextResponse.json(
      { message: "Content-Type must be multipart/form-data" },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const imageFile = formData.get('image') as File;
  
  if (!imageFile) {
    return NextResponse.json(
      { message: "Image is required" },
      { status: 400 }
    );
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(imageFile.type)) {
    return NextResponse.json(
      { message: "Only image files are allowed" },
      { status: 400 }
    );
  }

  console.log('Image validation passed:', imageFile.name, imageFile.type);

  const tempDir = path.join(process.cwd(), "public/temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const tempPath = path.join(tempDir, `${Date.now()}-${imageFile.name}`);
  const buffer = Buffer.from(await imageFile.arrayBuffer());
  fs.writeFileSync(tempPath, buffer);

  let cloudinaryRes: CloudinaryResponse | null;
  cloudinaryRes = await uploadOnCloudinary(tempPath, "rakhi-studio/paintings");

  if (!cloudinaryRes) {
    fs.unlinkSync(tempPath);
    return NextResponse.json(
      { message: "Image upload failed" },
      { status: 500 }
    );
  }

  console.log('Image uploaded to Cloudinary successfully:', cloudinaryRes.secure_url);

  // Delete temp file
  try {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
      console.log('Temp file deleted:', tempPath);
    }
  } catch (error) {
    console.log('Temp file already deleted or not found:', tempPath);
  }

  const paintingData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    medium: formData.get('medium') as string,
    size: formData.get('size') as string,
    year: Number(formData.get('year')),
    availability: formData.get('availability') as "in-stock" | "sold",
    tags: JSON.parse(formData.get('tags') as string || '[]'),
    image: cloudinaryRes.secure_url,
    categoryId: formData.get('categoryId') as string,
  };

  const token = req.cookies.get("access_token")?.value;
  const user = token ? verifyAccessToken(token) : null;

  const created = await Painting.create(paintingData);

  if (user) {
    await AdminLog.create({
      adminId: user.userId,
      action: "CREATE_PAINTING",
      targetId: created._id,
    });
  }

  revalidateTag("paintings", "default");

  return NextResponse.json(created, { status: 201 });
};