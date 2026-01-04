import { NextRequest, NextResponse } from 'next/server';
import Image from '@/models/Image';
import Gallery from '@/models/gallery';
import { dbConnect } from '@/lib/db';
import { deleteFromCloudinary, extractPublicIdFromUrl } from '../../../../cloudinary';
import { requireRole } from '@/lib/rbac';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authError = await requireRole(request, ['ADMIN', 'SUPER_ADMIN']);
    if (authError) return authError;

    const { id: imageId } = await params;
    await dbConnect();

    // Find the image
    const image = await Image.findById(imageId);
    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Delete from Cloudinary (best effort)
    const publicId = extractPublicIdFromUrl(image.url);
    if (publicId) {
      try {
        await deleteFromCloudinary(publicId);
      } catch (cloudinaryError) {
        console.error('Failed to delete Cloudinary asset:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Remove image reference from gallery
    await Gallery.updateMany({ imageIds: imageId }, { $pull: { imageIds: imageId } });

    // Delete image from database
    await Image.findByIdAndDelete(imageId);

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
