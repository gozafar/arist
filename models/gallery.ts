import { Schema, Types, model, models } from "mongoose";

export interface GalleryDoc {
  title: string;
  description?: string;
  images: string[];              // Cloudinary URLs
  categoryId: Types.ObjectId;     // Reference to Category
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<GalleryDoc>(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one image is required",
      },
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

GallerySchema.index({ categoryId: 1, createdAt: -1 });
export default models.Gallery || model<GalleryDoc>("Gallery", GallerySchema);
