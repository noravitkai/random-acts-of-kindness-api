import { Types, Document } from "mongoose";
import { User } from "./userInterface";
import { Category } from "./categoryInterface";

export interface KindnessAct extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: Types.ObjectId | Category["_id"];
  difficulty: "easy" | "medium" | "hard";
  createdBy: Types.ObjectId | User["_id"];
  status: "pending" | "approved" | "rejected";
}
