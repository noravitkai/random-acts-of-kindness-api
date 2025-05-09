import { Types, Document } from "mongoose";
import { User } from "./userInterface";
import { KindnessAct } from "./kindnessActInterface";

export interface SavedAct extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | User["_id"];
  act: Types.ObjectId | KindnessAct["_id"];
  savedAt: Date;
}
