import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Painting from "@/models/Painting";
import Category from "@/models/Category";

export const dynamic = "force-dynamic";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const availability = searchParams.get("availability") || undefined;
  const categoryName = searchParams.get("categoryName") || undefined;

  await dbConnect();

  let query: any = {};
  
  // Handle availability filter
  if (availability) query.availability = availability;
  
  // Handle category filter by categoryName
  if (categoryName) {
    const category = await Category.findOne({ categoryName: categoryName });
    if (category) {
      query.categoryId = category._id;
    } else {
      // If category doesn't exist, return empty result
      return NextResponse.json(
        {
          items: [],
          pagination: {
            currentPage: page,
            pageSize: limit,
            totalItems: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          }
        },
        {
          headers: {
            "Cache-Control": "public, max-age=60"
          }
        }
      );
    }
  }
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
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1
      }
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60"
      }
    }
  );
};
