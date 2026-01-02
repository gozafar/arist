import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadOnCloudinary = async (localFilePath: string, folder?: string) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folder || "rakhi-studio",
      resource_type: "auto",
    });

    return response;
  } catch (error: unknown) {
    // remove temp file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    const message = error instanceof Error 
      ? error.message 
      : typeof error === 'object' && error !== null && 'error' in error && error.error instanceof Error
        ? error.error.message
        : 'Unknown Cloudinary upload error';

    console.error("Cloudinary Error:", error);
    throw new Error(message);
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return false;

    const response = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete response:', response);
    
    return response.result === 'ok' || response.result === 'not found';
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    return false;
  }
};

export const updateOnCloudinary = async (localFilePath: string, existingPublicId?: string, folder?: string) => {
  try {
    if (!localFilePath) return null;

    // If there's an existing image, delete it first
    if (existingPublicId) {
      await deleteFromCloudinary(existingPublicId);
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folder || "paintings",
      resource_type: "auto",
    });

    console.log('Cloudinary update successful:', response.public_id);
    return response;
  } catch (error) {
    // remove temp file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error("Cloudinary Update Error:", error);
    return null;
  }
};

export default cloudinary;
