import { User } from "./userInterface";
import { Category } from "./categoryInterface";

export interface KindnessAct extends Document {
  _id: string;
  title: string;
  description: string;
  category: Category["_id"];
  difficulty: "easy" | "medium" | "hard";
  createdBy: User["_id"];
  status: "pending" | "approved" | "rejected";
}
