// Middleware for protecting authenticated routes
// Runs before route handlers to verify JWT tokens and enforce access control
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "./lib/jwt";

// Protect /favorites routes: verify JWT token from httpOnly cookie
export async function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const user = await verifySessionToken(token);

  // Redirect unauthenticated users to login with redirect parameter
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow authenticated users to proceed
  return NextResponse.next();
}

// Apply middleware only to /favorites routes
export const config = {
  matcher: ["/favorites/:path*"],
};