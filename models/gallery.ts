import { Schema, Types, model, models } from "mongoose";

export interface GalleryDoc {
  imageIds: Types.ObjectId[];  // Array of image document IDs
  name: string;  // This will act as the category/section - UNIQUE
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
    name: {
      type: String,
      required: true,
      unique: true,  // Enforce uniqueness at database level
      enum: [
        "Contemporary / Modern Art",
        "Portrait Paintings", 
        "Landscape Paintings",
        "Abstract Art"
      ]
    },
  },
  { timestamps: true }
);

// Add validation as pre-save hook to avoid validation on initial empty array
GallerySchema.pre('save', function(next) {
  // No image limit needed since galleries with same name are merged
  // Allow unlimited images per gallery
  next();
});

GallerySchema.index({ name: 1 }, { unique: true });  // Explicit unique index
GallerySchema.index({ name: 1, createdAt: -1 });

export default models.Gallery || model<GalleryDoc>("Gallery", GallerySchema);