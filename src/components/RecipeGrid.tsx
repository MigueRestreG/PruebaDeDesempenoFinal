"use client";

import { Alert, Grid } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecipeCard } from "@/components/RecipeCard";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { Favorite, Recipe } from "@/types";

export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const router = useRouter();
  const { user } = useAuth();
  const [message, setMessage] = useState<string | null>(null);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<Set<string>>(new Set());
  const [favoriteIdByRecipeId, setFavoriteIdByRecipeId] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setFavoriteRecipeIds(new Set());
        return;
      }

      try {
        const data = await apiFetch<{ favorites: Favorite[] }>("/api/favorites");
        setFavoriteRecipeIds(new Set(data.favorites.map((favorite) => favorite.recipeId)));
        setFavoriteIdByRecipeId(
          new Map(data.favorites.map((favorite) => [favorite.recipeId, favorite.id])),
        );
      } catch {
        setFavoriteRecipeIds(new Set());
        setFavoriteIdByRecipeId(new Map());
      }
    }

    void loadFavorites();
  }, [user]);

  async function toggleFavorite(recipeId: string) {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      if (favoriteRecipeIds.has(recipeId)) {
        const favoriteId = favoriteIdByRecipeId.get(recipeId);
        if (!favoriteId) {
          setMessage("No se pudo resolver el favorito para eliminar.");
          return;
        }

        await apiFetch<{ ok: boolean }>(`/api/favorites/${favoriteId}`, {
          method: "DELETE",
        });

        setFavoriteRecipeIds((current) => {
          const next = new Set(current);
          next.delete(recipeId);
          return next;
        });
        setFavoriteIdByRecipeId((current) => {
          const next = new Map(current);
          next.delete(recipeId);
          return next;
        });
        setMessage("Receta eliminada de favoritos.");
        return;
      }

      const data = await apiFetch<{ favorite: Favorite }>("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ recipeId }),
      });

      setFavoriteRecipeIds((current) => {
        const next = new Set(current);
        next.add(recipeId);
        return next;
      });
      setFavoriteIdByRecipeId((current) => {
        const next = new Map(current);
        next.set(data.favorite.recipeId, data.favorite.id);
        return next;
      });
      setMessage("Receta agregada a favoritos.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo actualizar favoritos.");
    }
  }

  return (
    <>
      {message ? <Alert sx={{ mb: 3 }}>{message}</Alert> : null}
      <Grid container spacing={3}>
        {recipes.map((recipe) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={recipe.id}>
            <RecipeCard
              recipe={recipe}
              onFavorite={toggleFavorite}
              isFavorite={favoriteRecipeIds.has(recipe.id)}
              favoriteLabel={favoriteRecipeIds.has(recipe.id) ? "Quitar" : "Guardar"}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
