import { Types, Document } from "mongoose";

export interface User extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
}
