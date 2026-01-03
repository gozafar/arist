import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Painting, { PaintingDoc } from '@/models/Painting';
import AdminLog from '@/models/AdminLog';
import { requireRole } from '@/lib/rbac';
import { verifyAccessToken } from '@/lib/jwt';
import { uploadBufferOnCloudinary } from '../../cloudinary';

export const runtime = 'nodejs'; // 🔴 REQUIRED
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
  const imageEntry = formData.get('image');
  const imageFile = imageEntry instanceof File ? imageEntry : null;

  if (!imageFile) {
    return NextResponse.json({ message: 'Image is required' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(imageFile.type)) {
    return NextResponse.json({ message: 'Only image files are allowed' }, { status: 400 });
  }

  /* ===== CLOUDINARY UPLOAD ===== */

  const buffer = await safeFileToBuffer(imageFile);

  let cloudinaryRes;
  try {
    cloudinaryRes = await uploadBufferOnCloudinary(buffer, 'rakhi-studio/paintings', imageFile.type);
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    const message = err instanceof Error ? err.message : 'Image upload failed';
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

const safeFileToBuffer = async (file: File): Promise<Buffer> => {
  try {
    if (typeof file.arrayBuffer === 'function') {
      return Buffer.from(await file.arrayBuffer());
    }
    // Fallback for environments where arrayBuffer might not be present
    const res = await new Response(file).arrayBuffer();
    return Buffer.from(res);
  } catch (error) {
    console.error('Failed to read file buffer:', error);
    throw new Error('Unable to process uploaded file');
  }
};
