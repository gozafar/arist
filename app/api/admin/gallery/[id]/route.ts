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
  categoryId: string;
  imageIds: GalleryImage[];
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authError = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
        if (authError) return authError;

        const { id: galleryId } = await params;
        const formData = await request.formData();
        await dbConnect();

        const gallery = await Gallery.findById(galleryId).populate({
            path: 'imageIds',
            select: 'url name'
        });
        if (!gallery) {
            return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
        }

        const categoryId = formData.get('categoryId') as string;
        const imagesMetaJson = formData.get('imagesMeta') as string;
        const replacedImages = formData.getAll('replacedImages') as File[];
        const replacedImageIds = formData.getAll('replacedImageIds') as string[];

        let imagesMeta: ImageMeta[] = [];
        if (imagesMetaJson) {
            imagesMeta = JSON.parse(imagesMetaJson);
        }

        let hasUpdates = false;

        // Update category if changed
        if (categoryId && categoryId !== "" && categoryId !== gallery.categoryId.toString()) {
            gallery.categoryId = categoryId;
            hasUpdates = true;
        }

        // Handle image name changes and deletions
        for (const meta of imagesMeta) {
            const existingImage = gallery.imageIds.find((img: GalleryImage) => img._id.toString() === meta._id);
            
            if (meta.isDeleted && existingImage) {
                await deleteImageById(existingImage._id);
                gallery.imageIds = gallery.imageIds.filter((img: GalleryImage) => img._id.toString() !== meta._id);
                hasUpdates = true;
            } else if (existingImage && meta.name !== existingImage.name) {
                await Image.findByIdAndUpdate(existingImage._id, { name: meta.name });
                hasUpdates = true;
            }
        }

        // Handle image replacements
        if (replacedImages.length > 0) {
            for (let i = 0; i < replacedImages.length; i++) {
                const file = replacedImages[i];
                const imageId = replacedImageIds[i];
                
                if (file && imageId) {
                    const uploadResult = await uploadImageToCloudinary(file);
                    if (uploadResult) {
                        const existingImage = await Image.findById(imageId);
                        if (existingImage) {
                            await deleteImageFromCloudinary(existingImage.url);
                            const updatedName = imagesMeta.find((meta: ImageMeta) => meta._id === imageId)?.name;
                            await Image.findByIdAndUpdate(imageId, {
                                url: uploadResult.secure_url,
                                name: updatedName || existingImage.name
                            });
                        } else {
                            const newImageDoc = new Image({
                                url: uploadResult.secure_url,
                                name: imagesMeta.find((meta: ImageMeta) => meta._id === imageId)?.name || file.name,
                                galleryId: gallery._id,
                            });
                            const savedImage = await newImageDoc.save();
                            const index = gallery.imageIds.findIndex((img: GalleryImage) => img._id.toString() === imageId);
                            if (index !== -1) {
                                gallery.imageIds[index] = savedImage._id;
                            }
                        }
                        hasUpdates = true;
                    }
                }
            }
        }

        if (hasUpdates) {
            await gallery.save();
        }

        await gallery.populate([
            { path: "imageIds", select: "url name" },
            { path: "categoryId", select: "categoryName" }
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
        if (!gallery) {
            return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
        }

        // Delete all images
        await Promise.all(gallery.imageIds.map(async (imageId: string) => {
            const image = await Image.findById(imageId);
            if (image) {
                await deleteImageFromCloudinary(image.url);
                await Image.findByIdAndDelete(imageId);
            }
        }));

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