"use client";

import { Alert, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecipeCard } from "@/components/RecipeCard";
import { apiFetch } from "@/lib/api";
import type { Favorite } from "@/types";

export function FavoriteGrid({ favorites }: { favorites: Favorite[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function removeFavorite(favoriteId: string) {
    await apiFetch<{ ok: boolean }>(`/api/favorites/${favoriteId}`, {
      method: "DELETE",
    });

    setMessage("Favorito eliminado.");
    router.refresh();
  }

  return (
    <>
      {message ? <Alert sx={{ mb: 3 }}>{message}</Alert> : null}
      <Grid container spacing={3}>
        {favorites.map((favorite) =>
          favorite.recipe ? (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={favorite.id}>
              <RecipeCard
                recipe={favorite.recipe}
                onFavorite={() => removeFavorite(favorite.id)}
                favoriteLabel="Eliminar"
              />
            </Grid>
          ) : null,
        )}
      </Grid>
    </>
  );
}