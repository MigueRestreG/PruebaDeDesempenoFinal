import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { loginUser } from "@/services/auth.service";
import { loginSchema } from "@/utils/validators";
import { AUTH_COOKIE_NAME } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = loginSchema.parse(body);
    const { user, token } = await loginUser(input);
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
    const message = error instanceof Error ? error.message : "No se pudo iniciar sesion.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}