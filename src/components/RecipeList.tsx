"use client";

import { RecipeGrid } from "@/components/RecipeGrid";
import type { Recipe } from "@/types";

// Componente solicitado para listar recetas reutilizando la grilla principal.
export function RecipeList({ recipes }: { recipes: Recipe[] }) {
  return <RecipeGrid recipes={recipes} />;
}
