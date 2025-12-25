import { NextRequest, NextResponse } from "next/server";
import Gallery, { GalleryImage } from "@/models/gallery";
import { dbConnect } from "@/lib/db";
import { uploadOnCloudinary } from "../../../cloudinary";
import fs from "fs";
import path from "path";
import { requireRole } from "@/lib/rbac";


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authError = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
        if (authError) return authError;

        const { id: galleryId } = await params;

        const formData = await request.formData();

        const categoryId = formData.get('categoryId') as string;

        // Get new image files and names from FormData
        const newImageFiles = formData.getAll('images') as File[];
        const imageNamesData = formData.get('imageNames') as string;
        
        // Handle imageNames - could be single string or JSON array
        let newImageNames: string[] = [];
        if (imageNamesData) {
            try {
                // Try parsing as JSON array first
                const parsed = JSON.parse(imageNamesData);
                newImageNames = Array.isArray(parsed) ? parsed : [imageNamesData];
            } catch {
                // If not JSON, treat as single string or comma-separated
                newImageNames = imageNamesData.includes(',') ? imageNamesData.split(',') : [imageNamesData];
            }
        }

        await dbConnect();

        // Find existing gallery
        const gallery = await Gallery.findById(galleryId);
        if (!gallery) {
            return NextResponse.json(
                { error: "Gallery not found" },
                { status: 404 }
            );
        }

        // Get existing images to keep (from formData)
        const existingImagesJson = formData.get('existingImages') as string;
        let existingImages = existingImagesJson ? JSON.parse(existingImagesJson) : [];

        // If no existingImages provided, use current gallery images
        if (existingImages.length === 0 && gallery.images.length > 0) {
            existingImages = gallery.images;
        }

        // Track what fields are being updated
        let hasUpdates = false;
        let finalImages = [...existingImages];

        // Handle categoryId update
        if (categoryId) {
            gallery.categoryId = categoryId;
            hasUpdates = true;
        }

        // Handle new images upload
        if (newImageFiles.length > 0) {
            
            // Process new images
            const processedNewImages = [];
            for (let i = 0; i < newImageFiles.length; i++) {
                const file = newImageFiles[i];
                // Preserve database names, don't change them
                const imageName = existingImages[i]?.name || file.name;

                // Create temporary file
                const tempDir = path.join(process.cwd(), 'temp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }

                const tempFileName = `gallery-update-${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
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
                    processedNewImages.push({
                        url: uploadResult.secure_url,
                        name: imageName
                    });
                } else {
                    throw new Error(`Failed to upload image ${file.name} to Cloudinary`);
                }
            }
            
            // If uploading new images, replace existing ones (don't combine)
            finalImages = [...processedNewImages];
            hasUpdates = true;
        }

        // Handle only imageNames update (no new images, just rename existing ones)
        if (newImageNames.length > 0 && newImageFiles.length === 0 && existingImages.length > 0) {
            finalImages = existingImages.map((img: GalleryImage, index: number) => {
                if (index < newImageNames.length) {
                    return { ...img, name: newImageNames[index] };
                }
                return img;
            });
            hasUpdates = true;
        }

        // Validate total images count (must have 1-3 images)
        if (finalImages.length === 0 || finalImages.length > 3) {
            return NextResponse.json({
                error: "Gallery must have 1 to 3 images",
                errors: { images: "Between 1 and 3 images are required" }
            }, { status: 400 });
        }

        // Only save if there are actual updates
        if (!hasUpdates) {
            return NextResponse.json({
                gallery,
                message: "No updates provided"
            }, { status: 200 });
        }

        // Update gallery images
        gallery.images = finalImages;

        await gallery.save();
        // Temporarily remove populate to avoid Category model issue
        // await gallery.populate({ path: "categoryId", select: "categoryName" });

        return NextResponse.json({
            gallery,
            message: "Gallery updated successfully"
        }, { status: 200 });

    } catch (error: unknown) {

        return NextResponse.json({
            error: "Failed to update gallery",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}