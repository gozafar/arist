import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadOnCloudinary = async (localFilePath: string, folder?: string) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folder || 'rakhi-studio',
      resource_type: 'auto',
    });

    console.log('Cloudinary upload successful:', response.public_id);
    return response;
  } catch (error: unknown) {
    // remove temp file even if upload fails

    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'error' in error && error.error instanceof Error
          ? error.error.message
          : 'Unknown Cloudinary upload error';

    console.error('Cloudinary Error:', error);
    throw new Error(message);
  }
};

export const uploadBufferOnCloudinary = async (buffer: Buffer, folder?: string, mimeType?: string) => {
  try {
    if (!buffer) return null;

    // Detect MIME type if not provided (basic detection)
    let detectedMimeType = mimeType;
    if (!detectedMimeType) {
      // Simple MIME type detection based on buffer signature
      if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        detectedMimeType = 'image/jpeg';
      } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
        detectedMimeType = 'image/png';
      } else if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
        detectedMimeType = 'image/webp';
      } else {
        detectedMimeType = 'image/jpeg'; // Default to JPEG
      }
    }

    // Convert buffer to base64 data URI with correct MIME type
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${detectedMimeType};base64,${base64Data}`;

    const response = await cloudinary.uploader.upload(dataURI, {
      folder: folder || 'rakhi-studio',
      resource_type: 'auto',
    });

    console.log('Cloudinary buffer upload successful:', response.public_id);
    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'error' in error && error.error instanceof Error
          ? error.error.message
          : 'Unknown Cloudinary upload error';

    console.error('Cloudinary Buffer Upload Error:', error);
    throw new Error(message);
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) {
      console.log('No public ID provided for deletion');
      return false;
    }

    console.log('Attempting to delete Cloudinary image:', publicId);
    const response = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete response:', response);

    // Consider both 'ok' and 'not found' as success
    return response.result === 'ok' || response.result === 'not found';
  } catch (error) {
    console.error('Cloudinary Delete Error:', error);
    return false;
  }
};

export const updateOnCloudinary = async (localFilePath: string, existingPublicId?: string, folder?: string) => {
  try {
    if (!localFilePath) return null;

    // If there's an existing image, delete it first
    if (existingPublicId) {
      console.log('Deleting existing image:', existingPublicId);
      await deleteFromCloudinary(existingPublicId);
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folder || 'rakhi-studio/paintings', // FIXED: Use consistent folder structure
      resource_type: 'auto',
    });

    console.log('Cloudinary update successful:', response.public_id);
    return response;
  } catch (error) {
    // remove temp file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    console.error('Cloudinary Update Error:', error);
    return null;
  }
};

// NEW: Helper function to extract public ID from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');

    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      const publicIdParts = urlParts.slice(uploadIndex + 2);

      // Remove version number if it exists (starts with 'v' followed by digits)
      if (publicIdParts[0] && /^v\d+/.test(publicIdParts[0])) {
        publicIdParts.shift(); // Remove the version part
      }

      const publicId = publicIdParts.join('/').split('.')[0]; // Remove file extension
      return publicId;
    }

    return null;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

export default cloudinary;
