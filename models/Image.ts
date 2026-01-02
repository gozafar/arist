import { Schema, Types, model, models } from 'mongoose';

export interface ImageDoc {
  url: string; // Cloudinary secure_url
  name: string; // Image name
  galleryId: Types.ObjectId; // Reference to parent gallery
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<ImageDoc>(
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
    galleryId: {
      type: Schema.Types.ObjectId,
      ref: 'Gallery',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

ImageSchema.index({ galleryId: 1, createdAt: -1 });

export default models.Image || model<ImageDoc>('Image', ImageSchema);
