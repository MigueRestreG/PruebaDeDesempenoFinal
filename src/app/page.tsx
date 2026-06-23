import { Container, Stack, Typography } from "@mui/material";
import { RecipeList } from "@/components/RecipeList";
import { getRecipes } from "@/services/recipe.service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recipes = await getRecipes();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 900 }}>
          Catálogo de recetas
        </Typography>
        <Typography color="text.secondary">
          Explora recetas públicas, consulta sus detalles y guarda tus favoritas.
        </Typography>
      </Stack>
      <RecipeList recipes={recipes} />
    </Container>
  );
}