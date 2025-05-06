import { Schema, model } from "mongoose";
import { KindnessAct } from "../interfaces/kindnessActInterface";

const kindnessActSchema = new Schema<KindnessAct>(
  {
    title: { type: String, required: true, min: 3, max: 255 },
    description: { type: String, required: true, min: 10, max: 1024 },
    // category: { type: String, ref: "Category", required: true }, // TODO: Include when categories get implemented
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    createdBy: { type: String, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const KindnessActModel = model<KindnessAct>(
  "KindnessAct",
  kindnessActSchema
);
