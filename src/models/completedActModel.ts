import { Schema, model } from "mongoose";
import { CompletedAct } from "../interfaces/completedActInterface";

const completedActSchema = new Schema<CompletedAct>({
  user: { type: String, ref: "User", required: true },
  act: { type: String, ref: "KindnessAct", required: true },
  completedAt: { type: Date, default: Date.now },
});

export const CompletedActModel = model<CompletedAct>(
  "CompletedAct",
  completedActSchema
);
