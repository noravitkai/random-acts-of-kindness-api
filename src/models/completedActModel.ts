import { Schema, model } from "mongoose";
import { CompletedAct } from "../interfaces/completedActInterface";

const completedActSchema = new Schema<CompletedAct>(
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
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const CompletedActModel = model<CompletedAct>(
  "CompletedAct",
  completedActSchema
);
