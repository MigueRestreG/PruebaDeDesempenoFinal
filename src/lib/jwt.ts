import { jwtVerify, SignJWT } from "jose";
import type { UserSession } from "@/types";

export const AUTH_COOKIE_NAME = "recetario_session";

const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");

export async function signSessionToken(session: UserSession): Promise<string> {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token?: string): Promise<UserSession | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: String(payload.id),
      name: String(payload.name),
      lastName: typeof payload.lastName === "string" ? payload.lastName : "",
      email: String(payload.email),
    };
  } catch {
    return null;
  }
}