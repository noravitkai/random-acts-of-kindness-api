import { Schema, model } from "mongoose";
import { SavedAct } from "../interfaces/savedActInterface";

const savedActSchema = new Schema<SavedAct>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    act: { type: Schema.Types.ObjectId, ref: "KindnessAct", required: true },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: false,
    },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const SavedActModel = model<SavedAct>("SavedAct", savedActSchema);
