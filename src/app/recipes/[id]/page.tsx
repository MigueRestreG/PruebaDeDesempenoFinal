import { Box, Card, CardContent, Chip, Container, Divider, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { getRecipeById } from "@/services/recipe.service";
import type { Recipe } from "@/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

type DetailedStep = {
  title: string;
  details: string[];
  tip: string;
  minutes: number;
};

function pickIngredients(ingredients: string[], index: number): string[] {
  if (ingredients.length <= 3) {
    return ingredients;
  }

  const start = (index * 2) % ingredients.length;
  return [
    ingredients[start],
    ingredients[(start + 1) % ingredients.length],
    ingredients[(start + 2) % ingredients.length],
  ];
}

function buildDetailedSteps(recipe: Recipe): DetailedStep[] {
  const stepCount = Math.max(recipe.steps.length, 1);
  const minutesPerStep = Math.max(4, Math.round(recipe.preparationTime / stepCount));

  return recipe.steps.map((step, index) => {
    const ingredientsForStep = pickIngredients(recipe.ingredients, index);
    const heat = index % 2 === 0 ? "medio" : "medio-alto";

    return {
      title: `Etapa ${index + 1}`,
      details: [
        `Prepara y deja listos: ${ingredientsForStep.join(", ")}.`,
        step,
        `Mantiene ${heat} y cocina durante ${minutesPerStep} min, removiendo para lograr coccion uniforme.`,
      ],
      tip: `Tip: prueba sabor al final de esta etapa y ajusta sal, acidez o especias antes de continuar.`,
      minutes: minutesPerStep,
    };
  });
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  const detailedSteps = buildDetailedSteps(recipe);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <img
          src={recipe.image}
          alt={recipe.name}
          style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 24 }}
        />
        <Stack spacing={1}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 900 }}>
            {recipe.name}
          </Typography>
          <Typography color="text.secondary">{recipe.description}</Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
            <Chip label={`${recipe.preparationTime} min`} />
            <Chip label={`${recipe.servings} porciones`} />
            <Chip label={recipe.difficulty} color="primary" />
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing={1.5}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Ingredientes
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                {recipe.ingredients.map((item, index) => (
                  <Typography key={`${item}-${index}`}>• {item}</Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Antes de empezar
          </Typography>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography>1. Lava, corta y mide los ingredientes segun la receta.</Typography>
                <Typography>2. Organiza todo en la mesa de trabajo para cocinar sin interrupciones.</Typography>
                <Typography>3. Ten a mano una cuchara para probar y ajustar sazones en cada etapa.</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Paso a paso detallado
          </Typography>
          {detailedSteps.map((step, index) => (
            <Card key={`${step.title}-${index}`} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {step.title}
                    </Typography>
                    <Chip label={`${step.minutes} min aprox.`} size="small" color="primary" />
                  </Stack>

                  <Stack spacing={0.8}>
                    {step.details.map((detail, detailIndex) => (
                      <Typography key={`${step.title}-detail-${detailIndex}`}>{`${detailIndex + 1}. ${detail}`}</Typography>
                    ))}
                  </Stack>

                  <Typography color="text.secondary">{step.tip}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}