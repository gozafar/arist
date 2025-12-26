import { dbConnect } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Gallery from "@/models/gallery";
import Image from "@/models/Image";

// Ensure Image model is registered
import "@/models/Image";

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query
    const query: { categoryId?: string } = {};
    if (categoryId) {
      query.categoryId = categoryId;
    }

    await dbConnect();

    // Get galleries with pagination and populate images
    const galleries = await Gallery.find(query)
      .populate([
        { path: "categoryId", select: "categoryName" },
        { path: "imageIds", select: "url name" }
      ])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Gallery.countDocuments(query);

    return NextResponse.json({
      galleries,
      pagination:{
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}