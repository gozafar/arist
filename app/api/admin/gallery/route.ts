import { NextRequest, NextResponse } from "next/server";
import Gallery from "@/models/gallery";
import Image from "@/models/Image";
import Category from "@/models/Category"; // Ensure Category model is loaded
import { dbConnect } from "@/lib/db";
// import { requireRole } from "@/lib/rbac";
import { uploadOnCloudinary } from "../../cloudinary";
import fs from "fs";
import path from "path";
import { gallerySchemas, validateRequest, validateFiles } from "../../../../lib/validators/galleryValidator";

// Ensure Category model is registered
import "@/models/Category";
import "@/models/Image";

export async function POST(request: NextRequest) {
  // Declare variables outside try block for error logging
  let categoryId: string = "";
  let imageFiles: File[] = [];
  let imageNames: string[] = [];

  try {
    // const authError = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    // if (authError) return authError;

    const formData = await request.formData();


    // Extract fields from FormData
    categoryId = formData.get('categoryId') as string;

    // Get all image files and their names from FormData
    imageFiles = formData.getAll('images') as File[];
    imageNames = formData.getAll('imageNames') as string[];


    // Validate maximum 3 images
    if (imageFiles.length > 3) {
      return NextResponse.json({
        error: "Validation failed",
        errors: { images: "Maximum 3 images allowed" }
      }, { status: 400 });
    }

    // Validate categoryId and imageNames with Joi (images array validation handled separately)
    const validation = validateRequest(gallerySchemas.createGallery, {
      categoryId,
      images: [], // Pass empty array to satisfy Joi, files validated separately
      imageNames: imageNames // Pass actual image names for validation
    });



    // Validate files separately for detailed checks
    const fileValidation = validateFiles(imageFiles);



    if (!validation.isValid || !fileValidation.isValid) {
      const errors: { [key: string]: string } = {};

      // Add Joi validation errors
      if (validation.errors) {
        Object.assign(errors, validation.errors);
      }

      // Add file validation errors
      if (fileValidation.errors) {
        errors.images = fileValidation.errors.join(', ');
      }

      return NextResponse.json({
        error: "Validation failed",
        errors
      }, { status: 400 });
    }



    await dbConnect();

    // Process images - upload FormData files to Cloudinary
    const processedImages = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const imageName = imageNames[i] || file.name; // Fallback to file.name if no client name provided

      // Create temporary file
      const tempDir = path.join(process.cwd(), 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const tempFileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
      const tempFilePath = path.join(tempDir, tempFileName);

      // Convert File to buffer and write to temp file
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(tempFilePath, buffer);

      // Upload to Cloudinary
      const uploadResult = await uploadOnCloudinary(tempFilePath, "rakhi-studio/gallery");

      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      if (uploadResult) {
        processedImages.push({
          url: uploadResult.secure_url,
          name: imageName
        });
      } else {
        throw new Error(`Failed to upload image ${file.name} to Cloudinary`);
      }
    }



    // Create gallery first
    const gallery = new Gallery({
      imageIds: [], // Will be populated after image creation
      categoryId,
    });

    await gallery.save();


    // Prepare image documents with gallery reference
    const imageDocuments = processedImages.map(image => ({
      url: image.url,
      name: image.name,
      galleryId: gallery._id,
    }));

    // Use insertMany to create all images at once - each gets unique _id
    const insertedImages = await Image.insertMany(imageDocuments);

    // Update gallery with image IDs
    gallery.imageIds = insertedImages.map(img => img._id);
    await gallery.save();

    // Populate gallery with images and category
    await gallery.populate([
      { path: "imageIds", select: "url name" },
      { path: "categoryId", select: "categoryName" }
    ]);

    return NextResponse.json({ gallery, message: "Gallery created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to create gallery",
    }, { status: 500 });
  }
}

