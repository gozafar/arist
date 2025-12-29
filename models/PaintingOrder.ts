import { Schema, model, models, Types } from "mongoose";

export interface PaintingOrderDoc{
  user: {
    name: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    state: string;
    postal: string;
    country: string;
  };
  paintingId: Types.ObjectId;
//   quantity: number;
//   status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

const PaintingOrderSchema = new Schema<PaintingOrderDoc>(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true,unique:true},
      phone: { type: String,unique:true},
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal: { type: String, required: true },
      country:{type:String,required:true}
    },
    paintingId: { type: Schema.Types.ObjectId, required: true, ref: 'Painting' },
    // quantity: { type: Number, required: true },
    // status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered"], default: "pending" },
  },
  {
    timestamps: true,
  }
);

export default models.PaintingOrder || model<PaintingOrderDoc>("PaintingOrder", PaintingOrderSchema);
