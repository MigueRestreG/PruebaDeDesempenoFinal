import { NextResponse } from "next/server";
import { getRecipes } from "@/services/recipe.service";

export async function GET() {
  const recipes = await getRecipes();
  return NextResponse.json({ recipes });
}