import { NextRequest, NextResponse } from 'next/server';
import Gallery from '@/models/gallery';
import Image from '@/models/Image';
// import Category from "@/models/Category"; // Ensure Category model is loaded
import { dbConnect } from '@/lib/db';
// import { requireRole } from "@/lib/rbac";
import { uploadOnCloudinary } from '../../cloudinary';
import fs from 'fs';
import path from 'path';

// Ensure Category model is registered
import '@/models/Category';
import '@/models/Image';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract fields from FormData
    const imageFiles = formData.getAll('images') as File[];
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

    // Process images in parallel for better performance
    const imageUploadPromises = imageFiles.map(async (file, index) => {
      const imageName = imageNames[index] || file.name;

      // Create temporary file
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempFileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
      const tempFilePath = path.join(tempDir, tempFileName);

      try {
        // Convert File to buffer and write to temp file
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(tempFilePath, buffer);

        // Upload to Cloudinary
        const uploadResult = await uploadOnCloudinary(tempFilePath, 'rakhi-studio/gallery');

        return {
          url: uploadResult?.secure_url,
          name: imageName,
        };
      } finally {
        // Clean up temp file
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    });

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(imageUploadPromises);

    // Filter out failed uploads
    const processedImages = uploadResults.filter(result => result.url);

    if (processedImages.length === 0) {
      throw new Error('Failed to upload any images to Cloudinary');
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
    console.error('Gallery create error:', error);
    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}
