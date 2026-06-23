// JWT utility module for secure token management
// Uses jose library for ECDSA/HMAC signing and verification
import { jwtVerify, SignJWT } from "jose";
import type { UserSession } from "@/types";

// Cookie name for storing session tokens (httpOnly, Secure in production)
export const AUTH_COOKIE_NAME = "recetario_session";

// Secret key for HS256 token signing (must be 32+ bytes for production)
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-secret-change-me");

// Sign a JWT token with user session data
// Token expires in 7 days and includes iat/exp claims for security validation
export async function signSessionToken(session: UserSession): Promise<string> {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

// Verify JWT token and extract user session data
// Returns null if token is invalid, expired, or malformed (fail-safe approach)
export async function verifySessionToken(token?: string): Promise<UserSession | null> {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    // Type-safe payload extraction with fallbacks for lastName compatibility
    return {
      id: String(payload.id),
      name: String(payload.name),
      lastName: typeof payload.lastName === "string" ? payload.lastName : "",
      email: String(payload.email),
    };
  } catch {
    return null; // Invalid or expired tokens are silently rejected
  }
}