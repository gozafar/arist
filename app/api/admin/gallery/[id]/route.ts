import { NextRequest, NextResponse } from "next/server";
import Gallery from "@/models/gallery";
import Image from "@/models/Image";
import { dbConnect } from "@/lib/db";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../../cloudinary";
import fs from "fs";
import path from "path";
import { requireRole } from "@/lib/rbac";

interface ImageMeta {
  _id: string;
  name: string;
  isDeleted: boolean;
}

interface GalleryImage {
  _id: string;
  url: string;
  name: string;
}

interface GalleryData {
  _id: string;
  imageIds: GalleryImage[];
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authError = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
        if (authError) return authError;
        const { id: galleryId } = await params;
        const formData = await request.formData();
        await dbConnect();

        const gallery = await Gallery.findById(galleryId);
        if (!gallery) {
            return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
        }

        const name = formData.get('name') as string;
        const imagesMetaJson = formData.get('imagesMeta') as string;
        const replacedImages = formData.getAll('replacedImages') as File[];
        const replacedImageIds = formData.getAll('replacedImageIds') as string[];

        // Validate gallery name
        if (name) {
            const validGalleryNames = [
                "Contemporary / Modern Art",
                "Portrait Paintings", 
                "Landscape Paintings",
                "Abstract Art"
            ];
            
            if (!validGalleryNames.includes(name)) {
                return NextResponse.json({
                    error: "Validation failed",
                    errors: { name: "Invalid gallery name. Must be one of the predefined categories." }
                }, { status: 400 });
            }
        }

        let imagesMeta: ImageMeta[] = [];
        if (imagesMetaJson) {
            imagesMeta = JSON.parse(imagesMetaJson);
        }

        if (replacedImages.length !== replacedImageIds.length) {
            return NextResponse.json({ error: "Mismatched replacement images" }, { status: 400 });
        }

        // Get current images once
        const currentImages = await Image.find({ _id: { $in: gallery.imageIds } });
        const galleryImageIdSet = new Set(currentImages.map(img => img._id.toString()));

        // Validate image references
        for (const repId of replacedImageIds) {
            if (!galleryImageIdSet.has(repId)) {
                return NextResponse.json({ error: "Invalid image to replace" }, { status: 400 });
            }
        }

        for (const meta of imagesMeta) {
            if (!galleryImageIdSet.has(meta._id)) {
                return NextResponse.json({ error: "Invalid image reference" }, { status: 400 });
            }
        }

        // Check for unique names efficiently
        const toDelete = new Set(imagesMeta.filter(m => m.isDeleted).map(m => m._id));
        const nameUpdates = new Map(imagesMeta.filter(m => !m.isDeleted && m.name).map(m => [m._id, m.name.trim()]));

        const resultingNames = new Set<string>();
        let resultingCount = 0;

        for (const img of currentImages) {
            if (toDelete.has(img._id.toString())) continue;
            const finalName = nameUpdates.get(img._id.toString()) || img.name;
            const normalizedName = finalName.trim().toLowerCase();
            
            if (resultingNames.has(normalizedName)) {
                return NextResponse.json({ error: `Duplicate image name: ${finalName}` }, { status: 400 });
            }
            resultingNames.add(normalizedName);
            resultingCount += 1;
        }

        if (resultingCount === 0 && replacedImages.length === 0) {
            return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
        }

        let hasUpdates = false;

        // Update gallery name if changed
        if (name && name.trim() !== "" && name.trim() !== gallery.name) {
            const existingGallery = await Gallery.findOne({ name: name.trim(), _id: { $ne: gallery._id } });
            if (existingGallery) {
                return NextResponse.json({ 
                    error: "Gallery name already exists. Gallery names must be unique." 
                }, { status: 400 });
            }
            gallery.name = name.trim();
            hasUpdates = true;
        }

        // Prepare all operations in parallel
        const operations: Promise<any>[] = [];

        // Handle image deletions and name updates
        for (const meta of imagesMeta) {
            if (meta.isDeleted) {
                // Delete image from Cloudinary and DB
                operations.push((async () => {
                    const image = currentImages.find(img => img._id.toString() === meta._id);
                    if (image) {
                        await deleteImageFromCloudinary(image.url);
                        await Image.findByIdAndDelete(meta._id);
                        // Remove from gallery imageIds
                        gallery.imageIds = gallery.imageIds.filter((id: any) => id.toString() !== meta._id);
                    }
                })());
            } else if (meta.name) {
                const image = currentImages.find(img => img._id.toString() === meta._id);
                if (image && image.name !== meta.name) {
                    operations.push(Image.findByIdAndUpdate(meta._id, { name: meta.name }).exec());
                }
            }
        }

        // Handle image replacements in parallel
        if (replacedImages.length > 0) {
            const replacementPromises = replacedImages.map(async (file, index) => {
                const imageId = replacedImageIds[index];
                
                if (file && imageId) {
                    const uploadResult = await uploadImageToCloudinary(file);
                    if (uploadResult) {
                        const existingImage = currentImages.find(img => img._id.toString() === imageId);
                        if (existingImage) {
                            await deleteImageFromCloudinary(existingImage.url);
                            const updatedName = imagesMeta.find(meta => meta._id === imageId)?.name;
                            await Image.findByIdAndUpdate(imageId, {
                                url: uploadResult.secure_url,
                                name: updatedName || existingImage.name
                            });
                        }
                    }
                }
            });
            operations.push(...replacementPromises);
        }

        // Execute all operations in parallel
        if (operations.length > 0) {
            await Promise.all(operations);
            hasUpdates = true;
        }

        if (hasUpdates) {
            await gallery.save();
        }

        // Final populate
        await gallery.populate([
            { path: "imageIds", select: "url name" }
        ]);

        return NextResponse.json({
            gallery,
            message: hasUpdates ? "Gallery updated successfully" : "No changes made"
        });

    } catch (error) {
        return NextResponse.json({
            error: "Failed to update gallery",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authError = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
        if (authError) return authError;

        const { id: galleryId } = await params;
        await dbConnect();

        const gallery = await Gallery.findById(galleryId).populate('imageIds');
        
        // If gallery doesn't exist, just return success (idempotent)
        if (!gallery) {
            return NextResponse.json({ message: "Gallery not found or already deleted" }, { status: 200 });
        }

        // Delete all images (only if images exist)
        if (gallery.imageIds && gallery.imageIds.length > 0) {
            await Promise.all(gallery.imageIds.map(async (imageId: string) => {
                const image = await Image.findById(imageId);
                if (image) {
                    await deleteImageFromCloudinary(image.url);
                    await Image.findByIdAndDelete(imageId);
                }
            }));
        }

        // Delete gallery
        await Gallery.findByIdAndDelete(galleryId);

        return NextResponse.json({ message: "Gallery deleted successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: "Failed to delete gallery",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}   

async function uploadImageToCloudinary(file: File) {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFileName = `temp-${Date.now()}-${file.name}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(tempFilePath, buffer);
        return await uploadOnCloudinary(tempFilePath, "rakhi-studio/gallery");
    } finally {
        if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
        }
    }
}

async function deleteImageById(imageId: string) {
    const image = await Image.findById(imageId);
    if (image) {
        await deleteImageFromCloudinary(image.url);
        await Image.findByIdAndDelete(imageId);
    }
}

async function deleteImageFromCloudinary(url: string) {
    try {
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1]?.split('.')[0];
        if (fileName) {
            const publicId = `rakhi-studio/gallery/${fileName}`;
            await deleteFromCloudinary(publicId);
        }
    } catch (error) {
        // Silent error handling
    }
}
