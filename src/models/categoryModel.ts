import { Schema, model } from "mongoose";
import { Category } from "../interfaces/categoryInterface";

const categorySchema = new Schema<Category>({
  name: { type: String, required: true, unique: true, min: 5, max: 60 },
  description: { type: String, min: 20, max: 255 },
});

export const CategoryModel = model<Category>("Category", categorySchema);
