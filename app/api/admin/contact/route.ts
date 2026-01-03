import { NextRequest, NextResponse } from 'next/server';
// import mongoose from 'mongoose';
import Contact from '@/models/Contact';
import { dbConnect } from '@/lib/db';

interface ContactQuery {
  status?: string;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
    message?: { $regex: string; $options: string };
  }>;
}

// GET /api/admin/contact - Get all contacts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    // Build query
    const query: ContactQuery = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    await dbConnect();

    // Get contacts with pagination
    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-__v');

    // Get total count for pagination
    const total = await Contact.countDocuments(query);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      filters: {
        status,
        search,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
