import { dbConnect } from '@/lib/db';
import { requireRole } from '@/lib/rbac';
import Category from '@/models/Category';
import Painting from '@/models/Painting';
// import { promises } from "dns";
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

// export const PUT = async (
//     req: NextRequest,
//     { params }: { params: { id: string } }
// ) => {
//     console.log(params,"======>9")
//      console.log("ID==================:", params.id);

//     // const authError = await requireRole(req, ["ADMIN", "SUPER_ADMIN"]);
//     // if (authError) return authError;
//     try {
//         const {id} = params;
//         console.log(id,"=======>16")
//         if (!id) {
//             return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
//         }

//         const { categoryName } = await req.json();
//         if (!categoryName || typeof categoryName !== "string") {
//             return NextResponse.json({ error: "categoryName is required" }, { status: 400 });
//         }

//         const name = categoryName.trim().toLowerCase();
//         console.log(name,"=======26")
//         await dbConnect();

//         // Check if another category with same name exists
//         const exists = await Category.findOne({ categoryName: name, _id: { $ne: id } });
//         if (exists) {
//             return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
//         }

//         // Update the category
//         const updated = await Category.findByIdAndUpdate(
//             id,
//             { categoryName: name },
//             { new: true } // return updated document
//         ).lean();

//         if (!updated) {
//             return NextResponse.json({ error: "Category not found" }, { status: 404 });
//         }

//         return NextResponse.json(updated);

//     } catch (err) {
//         console.error("PUT /categories/[id] error:", err);
//         return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
//     }
// };

export const PUT = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  try {
    const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
    if (authError) return authError;
    const params = await context.params;
    const id = params.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
    }

    const { categoryName } = await req.json();
    if (!categoryName || typeof categoryName !== 'string') {
      return NextResponse.json({ error: 'categoryName is required' }, { status: 400 });
    }

    const name = categoryName.trim().toLowerCase();

    await dbConnect();

    // Update the category
    const updated = await Category.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      { categoryName: name },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
};

export const GET = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authError) return authError;
  const params = await context.params;
  const id = params.id;

  try {
    // const id = params.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
    }

    await dbConnect();

    // Fetch category by ID
    const category = await Category.findById(new mongoose.Types.ObjectId(id)).lean();

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
  const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
  if (authError) return authError;
  const params = await context.params;
  const id = params.id;

  try {
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Category ID format' }, { status: 400 });
    }

    await dbConnect();

    // Delete category
    // const deleted = await Category.findByIdAndDelete(new mongoose.Types.ObjectId(id)).lean();

    // if (!deleted) {
    //     return NextResponse.json(
    //         { error: "Category not found" },
    //         { status: 404 }
    //     );
    // }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
};

// export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
//   const authError = await requireRole(req, ['ADMIN', 'SUPER_ADMIN']);
//   if (authError) return authError;

//   const paramsId = await params;
//   const { id } = paramsId;
//   console.log({id},"================>172")

//   // if (!mongoose.Types.ObjectId.isValid(id)) {
//   //   return NextResponse.json(
//   //     { error: "Invalid Category ID" },
//   //     { status: 400 }
//   //   );
//   // }

//   await dbConnect();

//   const session = await mongoose.startSession();
//   const cloudinaryPublicIds: string[] = [];

//   try {
//     await session.withTransaction(async () => {
//       const paintings = await Painting.find({ categoryId: id }, null, { session });

//       // Collect all Cloudinary public IDs before deleting
//       for (const painting of paintings) {
//         if (painting.image) {
//           const urlParts = painting.image.split('/');
//           const fileName = urlParts[urlParts.length - 1];
//           cloudinaryPublicIds.push(`paintings/${fileName.split('.')[0]}`);
//         }
//       }

//       // Delete paintings from database first
//       await Painting.deleteMany({ categoryId: id }, { session });

//       // Delete category from database
//       const deletedCategory = await Category.findByIdAndDelete(id, { session });
//       console.log(deleteFromCloudinary,"-------------->204")
//       if (!deletedCategory) {
//         throw new Error('Category not found');
//       }
//     });

//     // 🔥 Delete Cloudinary images AFTER DB success
//     for (const publicId of cloudinaryPublicIds) {
//       try {
//         await deleteFromCloudinary(publicId);
//       } catch (err) {
//         console.error('Cloudinary cleanup failed:', publicId);
//       }
//     }

//     return NextResponse.json({
//       message: 'Category and related data deleted successfully',
//     });
//   } catch (error) {
//     console.error('Category delete error:', error);
//     return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
//   } finally {
//     session.endSession();
//   }
// };
