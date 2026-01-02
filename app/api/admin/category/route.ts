import { dbConnect } from '@/lib/db';
import { requireRole } from '@/lib/rbac';
import Category from '@/models/Category';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// interface CategoryDocument {
//   _id: mongoose.Types.ObjectId;
//   categoryName: string;
//   createdAt: string;
//   updatedAt: string;
// }

interface CategoryResponse {
  id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export const POST = async (req: NextRequest) => {
  const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authError) return authError;

  await dbConnect();

  try {
    const { categoryName } = await req.json();

    if (!categoryName || typeof categoryName !== 'string') {
      return NextResponse.json({ error: 'categoryName is required' }, { status: 400 });
    }

    const name = categoryName.trim().toLowerCase();

    const exists = await Category.findOne({ categoryName: name });
    if (exists) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    const created = await Category.create({ categoryName: name });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authError) return authError;

  try {
    await dbConnect();

    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    // Transform _id to id for frontend compatibility
    const transformedCategories: CategoryResponse[] = categories.map(cat => ({
      id: (cat._id as mongoose.Types.ObjectId).toString(),
      categoryName: cat.categoryName as string,
      createdAt: cat.createdAt as string,
      updatedAt: cat.updatedAt as string,
    }));

    return NextResponse.json(transformedCategories);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
};
