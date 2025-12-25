import { NextRequest, NextResponse } from "next/server";
import Gallery from "@/models/gallery";
import Category from "@/models/Category";
import { dbConnect } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, images, categoryId } = body;

    // Validation
    if (!title || title.trim().length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Create gallery
    const gallery = new Gallery({
      title: title.trim(),
      description: description?.trim() || "",
      images,
      categoryId,
    });

    await gallery.save();

    // Populate category details
    await gallery.populate("categoryId", "categoryName");

    return NextResponse.json(
      {
        message: "Gallery created successfully",
        gallery,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating gallery:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create gallery" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query
    const query: any = {};
    if (categoryId) {
      query.categoryId = categoryId;
    }

    // Get galleries with pagination
    const galleries = await Gallery.find(query)
      .populate("categoryId", "categoryName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Gallery.countDocuments(query);

    return NextResponse.json({
      galleries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json(
      { error: "Failed to fetch galleries" },
      { status: 500 }
    );
  }
}