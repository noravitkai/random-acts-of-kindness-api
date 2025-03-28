import { Schema, model } from "mongoose";
import { Category } from "../interfaces/categoryInterface";

const categorySchema = new Schema<Category>({
  name: { type: String, required: true, unique: true, min: 2, max: 255 },
  description: { type: String, max: 1024 },
});

export const CategoryModel = model<Category>("Category", categorySchema);
