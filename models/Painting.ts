import { Schema, Types, model, models } from 'mongoose';

export interface PaintingDoc {
  _id: Types.ObjectId;
  title: string;
  price: number;
  medium: string;
  size: string;
  year: number;
  description: string;
  image: string;
  tags: string[];
  availability: 'in-stock' | 'sold';
  categoryId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaintingSchema = new Schema<PaintingDoc>(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    medium: { type: String, required: true },
    size: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String }],
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    availability: { type: String, enum: ['in-stock', 'sold'], default: 'in-stock', index: true },
  },
  {
    timestamps: true,
  }
);

export default models.Painting || model<PaintingDoc>('Painting', PaintingSchema);
