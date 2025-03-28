import { User } from "./userInterface";
import { KindnessAct } from "./kindnessActInterface";

export interface CompletedAct extends Document {
  _id: string;
  user: User["_id"];
  act: KindnessAct["_id"];
  completedAt: Date;
}
