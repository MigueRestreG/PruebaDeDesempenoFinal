// User registration API endpoint
// Validates input, creates user, sends welcome email, and returns JWT token
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { loginUser, registerUser } from "@/services/auth.service";
import { registerSchema } from "@/utils/validators";
import { AUTH_COOKIE_NAME } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate input: name, lastName, email, password, confirmPassword
    const input = registerSchema.parse(body);
    // Create user and send welcome email
    const user = await registerUser(input);
    // Auto-login: generate JWT token after registration
    const { token } = await loginUser({ email: input.email, password: input.password });
    const cookieStore = await cookies();

    // Set httpOnly cookie with 7-day expiration
    // Secure flag enabled in production to prevent transmission over HTTP
    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Return user data (token is in secure cookie)
    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo registrar el usuario.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}