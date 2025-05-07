import { Schema, model } from "mongoose";
import { SavedAct } from "../interfaces/savedActInterface";

const savedActSchema = new Schema<SavedAct>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    act: { type: Schema.Types.ObjectId, ref: "KindnessAct", required: true },
    savedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const SavedActModel = model<SavedAct>("SavedAct", savedActSchema);
