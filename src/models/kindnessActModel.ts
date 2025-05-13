import { Schema, model } from "mongoose";
import { KindnessAct } from "../interfaces/kindnessActInterface";

const kindnessActSchema = new Schema<KindnessAct>(
  {
    title: { type: String, required: true, min: 5, max: 60 },
    description: { type: String, required: true, min: 20, max: 255 },
    // category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, // TODO: Include when categories get implemented
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
