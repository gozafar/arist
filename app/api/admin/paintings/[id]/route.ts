import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Painting from '@/models/Painting';
import AdminLog from '@/models/AdminLog';
import { requireRole } from '@/lib/rbac';
import { verifyAccessToken } from '@/lib/jwt';
import { deleteFromCloudinary, extractPublicIdFromUrl, uploadBufferOnCloudinary } from '../../../cloudinary';

export const dynamic = 'force-dynamic';

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const paramsId = await context.params;
  const id = await paramsId.id;
  const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authError) return authError;

  await dbConnect();

  // Check if request is multipart/form-data (for image updates)
  const contentType = req.headers.get('content-type');
  let updateData: Record<string, unknown>;
  let newImageUrl: string | null = null;

  if (contentType && contentType.includes('multipart/form-data')) {
    // Handle FormData with image upload
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;

    // Get existing painting to extract current image URL
    const existingPainting = await Painting.findById(id);
    if (!existingPainting) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    // Handle image upload if provided
    if (imageFile) {
      // Validate image type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json({ message: 'Only image files are allowed' }, { status: 400 });
      }

      // Convert uploaded file to buffer for Cloudinary
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // Extract existing public ID from current image URL
      let existingPublicId: string | undefined;
      if (existingPainting.image) {
        const extractedId = extractPublicIdFromUrl(existingPainting.image);
        existingPublicId = extractedId || undefined;
        console.log('Extracted existing public ID:', existingPublicId);
      }

      // Upload new image to Cloudinary and clean up old asset after success
      let cloudinaryRes: Awaited<ReturnType<typeof uploadBufferOnCloudinary>>;
      try {
        cloudinaryRes = await uploadBufferOnCloudinary(buffer, 'rakhi-studio/paintings', imageFile.type);
      } catch (error) {
        console.error('Image upload failed:', error);
        return NextResponse.json({ message: 'Image upload failed' }, { status: 500 });
      }

      if (!cloudinaryRes) {
        return NextResponse.json({ message: 'Image upload failed' }, { status: 500 });
      }

      newImageUrl = cloudinaryRes.secure_url;

      if (existingPublicId) {
        try {
          await deleteFromCloudinary(existingPublicId);
        } catch (error) {
          console.error('Failed to delete old Cloudinary asset:', error);
        }
      }
    }

    // Extract other form fields
    updateData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      medium: formData.get('medium') as string,
      size: formData.get('size') as string,
      year: Number(formData.get('year')),
      availability: formData.get('availability') as 'in-stock' | 'sold',
      tags: JSON.parse((formData.get('tags') as string) || '[]'),
      categoryId: formData.get('categoryId') as string,
    };

    // Add new image URL if image was uploaded
    if (newImageUrl) {
      updateData.image = newImageUrl;
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });
  } else {
    // Handle regular JSON payload (no image update)
    updateData = (await req.json()) as Record<string, unknown>;
  }
  const updated = await Painting.findByIdAndUpdate(id, updateData, { new: true }).lean();
  if (!updated || Array.isArray(updated)) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  const token = req.cookies.get('access_token')?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (user) await AdminLog.create({ adminId: user.userId, action: 'UPDATE_PAINTING' });
  revalidateTag('paintings', 'default');
  const { _id, ...rest } = updated;
  return NextResponse.json({ ...rest, id: _id?.toString?.() || id });
};

export const DELETE = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params;

    const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
    if (authError) return authError;

    await dbConnect();

    const removed = await Painting.findByIdAndDelete(id);
    if (!removed) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    // Delete image from Cloudinary if it exists
    if (removed.image) {
      try {
        console.log('Image URL to delete:', removed.image);

        // Use the new helper function
        const publicId = extractPublicIdFromUrl(removed.image);

        if (publicId) {
          console.log('Extracted public ID:', publicId);
          const cloudinaryDeleted = await deleteFromCloudinary(publicId);
          console.log('Cloudinary delete result:', cloudinaryDeleted);

          // Don't fail the operation if Cloudinary delete fails
          if (!cloudinaryDeleted) {
            console.log('Warning: Cloudinary delete failed, but continuing with database deletion');
          }
        } else {
          console.log('Could not extract public ID from URL:', removed.image);
        }
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        // Continue with deletion even if Cloudinary delete fails
      }
    }

    const token = req.cookies.get('access_token')?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (user) {
      await AdminLog.create({ adminId: user.userId, action: 'DELETE_PAINTING', targetId: id });
    }

    revalidateTag('paintings', 'default');

    return NextResponse.json({ status: 'ok' });
  } catch {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
};
