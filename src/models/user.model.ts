// User collection schema with timestamps for audit tracking
import { Schema, model, models, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    // User full name parts for flexibility in display (first name + last name)
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true, default: "" },
    // Email is case-insensitive and must be unique across all users
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Password stored as bcrypt hash (never store plaintext)
    password: { type: String, required: true },
  },
  { timestamps: true }, // Automatically track createdAt and updatedAt
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: string };

export const UserModel = models.User || model("User", userSchema);
