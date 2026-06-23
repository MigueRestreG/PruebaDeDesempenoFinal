import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { addFavorite, getFavoritesByUser } from "@/services/favorite.service";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/jwt";

async function getAuthedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function GET() {
  const user = await getAuthedUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const favorites = await getFavoritesByUser(user.id);
  return NextResponse.json({ favorites });
}

export async function POST(request: Request) {
  try {
    const user = await getAuthedUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const favorite = await addFavorite(user.id, String(body.recipeId));
    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo agregar el favorito.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}