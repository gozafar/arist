import { Schema, model, models } from "mongoose";

export interface CategoryDoc {
    categoryName : string;
}

const CategorySchema = new Schema<CategoryDoc>(
  {
    categoryName: { type: String, required: true, trim: true ,unique: true,lowercase: true },
  },
  {
    timestamps: true
  }
);

export default models.Category  || model<CategoryDoc>("Category", CategorySchema);