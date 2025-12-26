import { Schema, Types, model, models } from "mongoose";

export interface GalleryDoc {
  imageIds: Types.ObjectId[];  // Array of image document IDs
  categoryId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Clear the model cache to ensure new schema is used
delete models.Gallery;

const GallerySchema = new Schema<GalleryDoc>(
  {
    imageIds: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: "Image",
      }],
      default: []  // Default to empty array
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

// Add validation as pre-save hook to avoid validation on initial empty array
GallerySchema.pre('save', function(next) {
  // Only validate if imageIds is being modified and has content
  if (this.isModified('imageIds') && this.imageIds.length > 0) {
    if (this.imageIds.length > 3) {
      const error = new Error('Maximum 3 images allowed');
      return next(error);
    }
  }
  // For new documents, only validate if they already have images
  if (this.isNew && this.imageIds.length > 0 && this.imageIds.length > 3) {
    const error = new Error('Maximum 3 images allowed');
    return next(error);
  }
  next();
});

GallerySchema.index({ categoryId: 1, createdAt: -1 });

export default models.Gallery || model<GalleryDoc>("Gallery", GallerySchema);