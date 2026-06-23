import { UserModel, type UserDocument } from "@/models/user.model";
import type { UserSession } from "@/types";

export function serializeUser(user: UserDocument): UserSession {
  return {
    id: user._id.toString(),
    name: user.name,
    lastName: user.lastName ?? "",
    email: user.email,
  };
}

export async function getUserByEmail(email: string): Promise<UserDocument | null> {
  return UserModel.findOne({ email }).lean<UserDocument | null>();
}

export async function createUser(input: {
  name: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<UserDocument> {
  const user = await UserModel.create(input);
  return user.toObject() as UserDocument;
}
