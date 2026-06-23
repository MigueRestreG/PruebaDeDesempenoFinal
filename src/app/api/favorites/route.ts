// Favorites API: GET and POST endpoints (protected by authentication)
// GET: retrieve user's favorites
// POST: add recipe to user's favorites
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { addFavorite, getFavoritesByUser } from "@/services/favorite.service";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/jwt";

// Extract and verify user from JWT token in httpOnly cookie
async function getAuthedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// GET /api/favorites - Fetch user's favorite recipes
export async function GET() {
  const user = await getAuthedUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const favorites = await getFavoritesByUser(user.id);
  return NextResponse.json({ favorites });
}

// POST /api/favorites - Add recipe to user's favorites
export async function POST(request: Request) {
  try {
    const user = await getAuthedUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const body = await request.json();
    // Add favorite and return full favorite object with recipe data
    const favorite = await addFavorite(user.id, String(body.recipeId));
    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo agregar el favorito.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}