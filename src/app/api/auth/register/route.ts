import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { loginUser, registerUser } from "@/services/auth.service";
import { registerSchema } from "@/utils/validators";
import { AUTH_COOKIE_NAME } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = registerSchema.parse(body);
    const user = await registerUser(input);
    const { token } = await loginUser({ email: input.email, password: input.password });
    const cookieStore = await cookies();

    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo registrar el usuario.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}