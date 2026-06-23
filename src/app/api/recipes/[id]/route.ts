import { NextResponse } from "next/server";
import { getRecipeById } from "@/services/recipe.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { id } = await context.params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    return NextResponse.json({ error: "Receta no encontrada." }, { status: 404 });
  }

  return NextResponse.json({ recipe });
}