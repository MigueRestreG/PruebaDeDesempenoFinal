import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { signSessionToken, verifySessionToken } from "@/lib/jwt";
import { sendWelcomeEmail } from "@/services/email.service";
import { createUser, getUserByEmail, serializeUser } from "@/services/user.service";
import type { LoginInput, RegisterInput } from "@/utils/validators";
import type { UserSession } from "@/types";

// Servicio de autenticación separado de operaciones base de usuario (arquitectura por capas).
// Register new user: validate email uniqueness, hash password, send welcome email
// Returns serialized user data (without password) upon success
export async function registerUser(input: RegisterInput): Promise<UserSession> {
  await connectToDatabase();
  // Prevent duplicate email registrations
  const existingUser = await getUserByEmail(input.email);

  if (existingUser) {
    throw new Error("El email ya esta registrado.");
  }

  // Hash password with bcryptjs (salt=12 rounds for security)
  const password = await bcrypt.hash(input.password, 12);
  const user = await createUser({
    name: input.name,
    lastName: input.lastName,
    email: input.email,
    password,
  });
  // Send welcome email with user name (fails gracefully if SMTP not configured)
  await sendWelcomeEmail(input.email, input.name);
  return serializeUser(user);
}

// Login user: verify credentials and return JWT token
// Token is valid for 7 days and stored in httpOnly cookie for security
export async function loginUser(input: LoginInput): Promise<{ user: UserSession; token: string }> {
  await connectToDatabase();
  const user = await getUserByEmail(input.email);

  // Generic error message prevents email enumeration attacks
  if (!user) {
    throw new Error("Credenciales invalidas.");
  }

  // Compare plaintext password against bcrypt hash
  const isValid = await bcrypt.compare(input.password, user.password);
  if (!isValid) {
    throw new Error("Credenciales invalidas.");
  }

  const session = serializeUser(user);
  // Sign JWT with user data: includes id, name, lastName, email
  const token = await signSessionToken(session);

  return { user: session, token };
}

// Verify JWT token from request (used in protected API routes)
// Returns null if token is invalid, expired, or not provided
export async function verifyAuthToken(token?: string): Promise<UserSession | null> {
  return verifySessionToken(token);
}
