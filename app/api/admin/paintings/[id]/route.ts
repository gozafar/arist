import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { dbConnect } from '@/lib/db';
import Painting from '@/models/Painting';
import AdminLog from '@/models/AdminLog';
import { requireRole } from '@/lib/rbac';
import { verifyAccessToken } from '@/lib/jwt';
import { deleteFromCloudinary, updateOnCloudinary } from '../../../cloudinary';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const { id } = await context.params;
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

      // Create temp file
      const tempDir = path.join(process.cwd(), 'public/temp');
      if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

      const tempPath = path.join(tempDir, `${Date.now()}-${imageFile.name}`);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      fs.writeFileSync(tempPath, buffer);

      // Extract existing public ID from current image URL
      let existingPublicId: string | undefined;
      if (existingPainting.image) {
        const urlParts = existingPainting.image.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        existingPublicId = `paintings/${publicIdWithExtension.split('.')[0]}`;
      }

      // Upload new image to Cloudinary (will delete old one if existingPublicId provided)
      const cloudinaryRes = await updateOnCloudinary(tempPath, existingPublicId);

      if (!cloudinaryRes) {
        // Clean up temp file on failure
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
        return NextResponse.json({ message: 'Image upload failed' }, { status: 500 });
      }

      newImageUrl = cloudinaryRes.secure_url;

      // Delete temp file
      // try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      // } catch (error) {
      //   // Continue even if temp file deletion fails
      // }
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
  console.log(updateData, '=============>119');
  const updated = await Painting.findByIdAndUpdate(id, updateData, { new: true }).lean();
  console.log(updated, '============>121');
  if (!updated || Array.isArray(updated)) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  const token = req.cookies.get('access_token')?.value;
  const user = token ? verifyAccessToken(token) : null;
  if (user) await AdminLog.create({ adminId: user.userId, action: 'UPDATE_PAINTING' });
  revalidateTag('paintings', 'default');
  const { _id, ...rest } = updated;
  console.log('Updated painting data:', rest);
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
      // try {
      // Extract public ID from Cloudinary URL
      const urlParts = removed.image.split('/');

      const publicIdWithExtension = urlParts[urlParts.length - 1];

      const publicId = `paintings/${publicIdWithExtension.split('.')[0]}`;
      const cloudinaryDeleted = await deleteFromCloudinary(publicId);

      if (cloudinaryDeleted) {
        console.log('Successfully deleted from Cloudinary:', publicId);
      } else {
        console.log('Failed to delete from Cloudinary:', publicId);
      }
      // } catch (cloudinaryError) {
      //   // console.error('Error deleting from Cloudinary:', cloudinaryError);
      //   // Continue with database deletion even if Cloudinary fails
      // }
    } else {
      // console.log('No image URL found for painting');
    }

    const token = req.cookies.get('access_token')?.value;
    const user = token ? verifyAccessToken(token) : null;
    if (user) {
      // try {
      await AdminLog.create({ adminId: user.userId, action: 'DELETE_PAINTING', targetId: id });
      // console.log('Admin log created');
      // } catch (logError) {
      //   // console.error('Failed to create AdminLog:', logError);
      //   // Continue even if logging fails
      // }
    }

    revalidateTag('paintings', 'default');
    // console.log('Cache revalidated, returning success');

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    // console.error('DELETE route error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
