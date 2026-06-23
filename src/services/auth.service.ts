import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { signSessionToken, verifySessionToken } from "@/lib/jwt";
import { sendWelcomeEmail } from "@/services/email.service";
import { createUser, getUserByEmail, serializeUser } from "@/services/user.service";
import type { LoginInput, RegisterInput } from "@/utils/validators";
import type { UserSession } from "@/types";

// Servicio de autenticación separado de operaciones base de usuario (arquitectura por capas).
export async function registerUser(input: RegisterInput): Promise<UserSession> {
  await connectToDatabase();
  const existingUser = await getUserByEmail(input.email);

  if (existingUser) {
    throw new Error("El email ya esta registrado.");
  }

  const password = await bcrypt.hash(input.password, 12);
  const user = await createUser({
    name: input.name,
    lastName: input.lastName,
    email: input.email,
    password,
  });
  await sendWelcomeEmail(input.email, input.name);
  return serializeUser(user);
}

export async function loginUser(input: LoginInput): Promise<{ user: UserSession; token: string }> {
  await connectToDatabase();
  const user = await getUserByEmail(input.email);

  if (!user) {
    throw new Error("Credenciales invalidas.");
  }

  const isValid = await bcrypt.compare(input.password, user.password);
  if (!isValid) {
    throw new Error("Credenciales invalidas.");
  }

  const session = serializeUser(user);
  const token = await signSessionToken(session);

  return { user: session, token };
}

export async function verifyAuthToken(token?: string): Promise<UserSession | null> {
  return verifySessionToken(token);
}
