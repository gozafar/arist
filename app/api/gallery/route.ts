import { dbConnect } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import Gallery from '@/models/gallery';
// import Image from "@/models/Image";

// Ensure Image model is registered
import '@/models/Image';

interface GalleryImage {
  _id: string;
  url: string;
  name: string;
}

interface Gallery {
  _id: string;
  name: string;
  imageIds: GalleryImage[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface GalleryQuery {
  name?: {
    $regex: RegExp;
    $options?: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface GalleryResponse {
  galleries: Gallery[];
  pagination: PaginationInfo;
}

interface GroupedGalleryResponse {
  sections: Record<string, Gallery[]>;
  totalSections: number;
  totalGalleries: number;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<GalleryResponse | GroupedGalleryResponse | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const name = searchParams.get('name');
    const groupBySection = searchParams.get('groupBySection') === 'true';

    await dbConnect();

    // If groupBySection is true, return galleries grouped by name (sections)
    if (groupBySection) {
      const galleries = await Gallery.find({})
        .populate([{ path: 'imageIds', select: 'url name' }])
        .sort({ name: 1, createdAt: -1 });

      // Group galleries by name (section)
      const groupedGalleries = galleries.reduce(
        (acc, gallery) => {
          const sectionName = gallery.name;
          if (!acc[sectionName]) {
            acc[sectionName] = [];
          }
          acc[sectionName].push(gallery);
          return acc;
        },
        {} as Record<string, typeof galleries>
      );

      return NextResponse.json({
        sections: groupedGalleries,
        totalSections: Object.keys(groupedGalleries).length,
        totalGalleries: galleries.length,
      });
    }

    // Build query with proper typing
    const query: GalleryQuery = {};

    // Add name filter if provided, otherwise get all galleries
    if (name) {
      query.name = { $regex: new RegExp(`^${name}$`, 'i') };
    }

    // Get galleries with pagination and populate images
    const galleries = await Gallery.find(query)
      .populate([{ path: 'imageIds', select: 'url name' }])
      .sort({ name: 1, createdAt: -1 }) // Sort by name first, then by date
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
  } catch {
    return NextResponse.json({ error: 'Failed to fetch galleries' }, { status: 500 });
  }
}
