import { Schema, Types, model, models } from "mongoose";

export interface GalleryImage {
  url: string;   // Cloudinary secure_url
  name: string;  // Image name (stored only in DB)
}

export interface GalleryDoc {
  images: GalleryImage[];
  categoryId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<GalleryDoc>(
  {
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100,
          },
        },
      ],
      required: true,
      validate: {
        validator: (v: GalleryImage[]) =>
          Array.isArray(v) && v.length > 0 && v.length <= 3,
        message: "Between 1 and 3 images are required",
      },
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

GallerySchema.index({ categoryId: 1, createdAt: -1 });

export default models.Gallery || model<GalleryDoc>("Gallery", GallerySchema);