import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { Readable } from 'stream';

// let cloudinaryConfigured = false;

const ensureCloudinaryConfig = () => {
  // if (cloudinaryConfigured) return;

  cloudinary.config({
    cloud_name: 'dvtmoopfw',
    api_key: '873926628995261',
    api_secret: '6AIKZwvUqoDAqniXQJnYkz-yN5M',
  });

  // cloudinaryConfigured = true;
};

export const uploadOnCloudinary = async (localFilePath: string, folder?: string) => {
  try {
    ensureCloudinaryConfig();

    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folder || 'rakhi-studio',
      resource_type: 'auto',
    });

    // console.log('Cloudinary upload successful:', response.public_id);
    return response;
  } catch (error: unknown) {
    // remove temp file even if upload fails

    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'error' in error && error.error instanceof Error
          ? error.error.message
          : 'Unknown Cloudinary upload error';

    // console.error('Cloudinary Error:', error);
    throw new Error(message);
  }
};

export const uploadBufferOnCloudinary = async (buffer: Buffer, folder?: string, mimeType?: string) => {
  try {
    ensureCloudinaryConfig();

    if (!buffer || buffer.length === 0) {
      throw new Error('Empty buffer provided for Cloudinary upload');
    }

    const response = await new Promise<Awaited<ReturnType<typeof cloudinary.uploader.upload>> | undefined>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder || 'rakhi-studio',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result ?? undefined);
            }
          }
        );

        Readable.from(buffer).on('error', reject).pipe(uploadStream);
      }
    );

    return response;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'error' in error && error.error instanceof Error
          ? error.error.message
          : 'Unknown Cloudinary upload error';

    throw new Error(message);
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    ensureCloudinaryConfig();

    if (!publicId) {
      return false;
    }

    const response = await cloudinary.uploader.destroy(publicId);

    // Consider both 'ok' and 'not found' as success
    return response.result === 'ok' || response.result === 'not found';
  } catch (error) {
    return false;
  }
};

export const updateOnCloudinary = async (localFilePath: string, existingPublicId?: string, folder?: string) => {
  try {
    ensureCloudinaryConfig();

    if (!localFilePath) return null;

    // If there's an existing image, delete it first
    if (existingPublicId) {
      await deleteFromCloudinary(existingPublicId);
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: folder || 'rakhi-studio/paintings', // FIXED: Use consistent folder structure
      resource_type: 'auto',
    });

    return response;
  } catch (error) {
    // remove temp file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

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
  } catch {
    return null;
  }
};

export default cloudinary;
