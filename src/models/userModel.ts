import { Schema, model } from "mongoose";
import { User } from "../interfaces/userInterface";

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      min: 2,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      min: 6,
      max: 255,
      unique: true,
      match: /\S+@\S+\.\S+/,
    },
    password: { type: String, required: true, min: 6, max: 255 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", userSchema);
