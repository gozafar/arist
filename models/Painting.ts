import { Schema, model, models } from "mongoose";

export interface PaintingDoc {
  _id: string;
  title: string;
  price: number;
  medium: string;
  size: string;
  year: number;
  description: string;
  image: string;
  tags: string[];
  availability: "in-stock" | "sold";
  createdAt: Date;
  updatedAt: Date;
}

const PaintingSchema = new Schema<PaintingDoc>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    medium: { type: String, required: true },
    size: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String }],
    availability: { type: String, enum: ["in-stock", "sold"], default: "in-stock", index: true }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

export default models.Painting || model<PaintingDoc>("Painting", PaintingSchema);
