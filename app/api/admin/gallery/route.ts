import { NextRequest, NextResponse } from 'next/server';
import Gallery from '@/models/gallery';
import Image from '@/models/Image';
// import Category from "@/models/Category"; // Ensure Category model is loaded
import { dbConnect } from '@/lib/db';
// import { requireRole } from "@/lib/rbac";
import { uploadBufferOnCloudinary } from '../../cloudinary';

// Ensure Category model is registered
import '@/models/Category';
import '@/models/Image';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 });
    }

    const formData = await request.formData();

    // Extract fields from FormData
    const imageEntries = formData.getAll('images');
    const imageFiles = imageEntries.filter((entry): entry is File => entry instanceof File);
    const imageNames = formData.getAll('imageNames') as string[];
    const name = formData.get('name') as string;

    // Validate gallery name against hardcoded enum
    const validGalleryNames = [
      'Contemporary / Modern Art',
      'Portrait Paintings',
      'Landscape Paintings',
      'Abstract Art',
    ];

    if (!validGalleryNames.includes(name)) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: { name: 'Invalid gallery name. Must be one of the predefined categories.' },
        },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if gallery with this name already exists
    let gallery = await Gallery.findOne({ name });

    if (!gallery) {
      // Create new gallery if none exists
      gallery = new Gallery({
        imageIds: [],
        name,
      });
      await gallery.save();
    }

    if (imageFiles.length === 0) {
      return NextResponse.json({ error: 'No images provided for upload' }, { status: 400 });
    }

    let lastUploadError: string | null = null;

    // Process images in parallel for better performance
    const imageUploadPromises = imageFiles.map(async (file, index) => {
      const imageName = imageNames[index] || file.name;

      try {
        // Convert File to buffer and upload directly to Cloudinary
        const buffer = await fileToBuffer(file);
        const uploadResult = await uploadBufferOnCloudinary(buffer, 'rakhi-studio/gallery', file.type);

        return {
          url: uploadResult?.secure_url,
          name: imageName,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown upload error';
        lastUploadError = message;
        return null;
      }
    });

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(imageUploadPromises);

    // Filter out failed uploads
    const processedImages = uploadResults.filter(
      (result): result is { url: string; name: string } => result !== null && result.url !== undefined
    );

    if (processedImages.length === 0) {
      const reason = lastUploadError || 'Failed to upload any images to Cloudinary';
      throw new Error(reason);
    }

    // Prepare image documents with gallery reference
    const imageDocuments = processedImages.map(image => ({
      url: image.url,
      name: image.name,
      galleryId: gallery._id,
    }));

    // Use insertMany to create all images at once
    const insertedImages = await Image.insertMany(imageDocuments);

    // Add new image IDs to existing gallery
    gallery.imageIds.push(...insertedImages.map(img => img._id));
    await gallery.save();

    // Populate gallery with images
    await gallery.populate([{ path: 'imageIds', select: 'url name' }]);

    return NextResponse.json({ gallery, message: 'Gallery created successfully' }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create gallery';
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}

const fileToBuffer = async (file: File): Promise<Buffer> => {
  try {
    if (typeof file.arrayBuffer === 'function') {
      return Buffer.from(await file.arrayBuffer());
    }
    const res = await new Response(file).arrayBuffer();
    return Buffer.from(res);
  } catch {
    throw new Error('Unable to process uploaded image');
  }
};
