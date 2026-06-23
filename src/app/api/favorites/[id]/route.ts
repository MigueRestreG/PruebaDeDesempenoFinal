import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { removeFavorite } from "@/services/favorite.service";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/jwt";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const user = await verifySessionToken(token);

  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const removed = await removeFavorite(user.id, id);

  if (!removed) {
    return NextResponse.json({ error: "Favorito no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}