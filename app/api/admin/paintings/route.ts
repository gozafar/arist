import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Painting, { PaintingDoc } from '@/models/Painting';
import AdminLog from '@/models/AdminLog';
import { requireRole } from '@/lib/rbac';
import { verifyAccessToken } from '@/lib/jwt';
import fs from 'fs';
import path from 'path';
import { uploadOnCloudinary } from '../../cloudinary';

export const runtime = 'nodejs'; // 🔴 REQUIRED
export const dynamic = 'force-dynamic';

/* ================= GET ================= */

export const GET = async (req: NextRequest) => {
  const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authError) return authError;

  await dbConnect();

  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '50');
  const availability = searchParams.get('availability') || undefined;

  const query = availability ? { availability } : {};
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Painting.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean<PaintingDoc[]>(),
    Painting.countDocuments(query),
  ]);

  return NextResponse.json({
    items: items.map(item => {
      const { _id, ...rest } = item;
      if (!_id) {
        console.error('Painting missing _id:', item);
        return { ...rest, id: 'invalid' };
      }
      return { ...rest, id: _id.toString() };
    }),
    total,
    page,
    pageSize: limit,
  });
};

/* ================= POST ================= */

export const POST = async (req: NextRequest) => {
  const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authError) return authError;

  await dbConnect();

  const contentType = req.headers.get('content-type');
  if (!contentType?.includes('multipart/form-data')) {
    return NextResponse.json({ message: 'Content-Type must be multipart/form-data' }, { status: 400 });
  }

  const formData = await req.formData();
  const imageFile = formData.get('image') as File | null;

  if (!imageFile) {
    return NextResponse.json({ message: 'Image is required' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(imageFile.type)) {
    return NextResponse.json({ message: 'Only image files are allowed' }, { status: 400 });
  }

  /* ===== TEMP FILE SAVE ===== */

  const tempDir = path.join(process.cwd(), 'public/temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const tempPath = path.join(tempDir, `${Date.now()}-${imageFile.name}`);
  const buffer = Buffer.from(await imageFile.arrayBuffer());
  fs.writeFileSync(tempPath, buffer);

  /* ===== CLOUDINARY UPLOAD ===== */

  let cloudinaryRes;
  try {
    cloudinaryRes = await uploadOnCloudinary(tempPath, 'rakhi-studio/paintings');
  } catch (err) {
    return NextResponse.json({ message: 'Image upload failed' }, { status: 500 });
  }

  if (!cloudinaryRes) {
    return NextResponse.json({ message: 'Image upload failed' }, { status: 500 });
  }

  /* ===== SAVE DATA ===== */

  const paintingData = {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    medium: formData.get('medium') as string,
    size: formData.get('size') as string,
    year: Number(formData.get('year')),
    availability: formData.get('availability') as 'in-stock' | 'sold',
    tags: JSON.parse((formData.get('tags') as string) || '[]'),
    image: cloudinaryRes.secure_url,
    imagePublicId: cloudinaryRes.public_id, // ✅ IMPORTANT
    categoryId: formData.get('categoryId') as string,
  };

  const token = req.cookies.get('access_token')?.value;
  const user = token ? verifyAccessToken(token) : null;

  const created = await Painting.create(paintingData);

  if (user) {
    await AdminLog.create({
      adminId: user.userId,
      action: 'CREATE_PAINTING',
      targetId: created._id,
    });
  }

  revalidateTag('paintings', 'default'); // ✅ correct usage

  return NextResponse.json(created, { status: 201 });
};
