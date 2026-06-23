// Recipe card component: displays single recipe with visual difficulty indicators
// Used in catalog and favorites grids with dynamic favoriting
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { Recipe } from "@/types";

const fallbackImage = "/recipe-placeholder.svg";

// Difficulty configuration: color, label, and visual meter bars
const difficultyConfig = {
  Facil: {
    label: "Fácil",
    color: "success" as const,
    meterColor: "#2f8f4e", // Green
    bars: [true, false, false], // 1 bar
  },
  Media: {
    label: "Media",
    color: "warning" as const,
    meterColor: "#d97706", // Amber
    bars: [true, true, false], // 2 bars
  },
  Dificil: {
    label: "Difícil",
    color: "error" as const,
    meterColor: "#c2410c", // Red
    bars: [true, true, true], // 3 bars
  },
} satisfies Record<Recipe["difficulty"], {
  label: string;
  color: "success" | "warning" | "error";
  meterColor: string;
  bars: boolean[];
}>;

// Visual difficulty meter: shows 1-3 bars based on difficulty level
function DifficultyMeter({ difficulty }: { difficulty: Recipe["difficulty"] }) {
  const config = difficultyConfig[difficulty];

  return (
    <Box
      aria-label={`Nivel de dificultad ${config.label}`}
      sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
    >
      {config.bars.map((isActive, index) => (
        <Box
          key={`${config.label}-${index}`}
          sx={{
            width: 4,
            height: 8 + index * 4, // Increasing height: 8px, 12px, 16px
            borderRadius: 999,
            bgcolor: isActive ? config.meterColor : "rgba(15, 23, 42, 0.14)",
            boxShadow: isActive ? `0 0 0 1px ${config.meterColor}22` : "none",
          }}
        />
      ))}
    </Box>
  );
}

type RecipeCardProps = {
  recipe: Recipe;
  onFavorite?: (recipeId: string) => void; // Callback when user clicks favorite button
  favoriteLabel?: string; // Button label ("Guardar", "Quitar", "Eliminar")
  isFavorite?: boolean; // Whether recipe is in user's favorites
};

// Reusable recipe card with dynamic difficulty styling and favorite toggle
export function RecipeCard({ recipe, onFavorite, favoriteLabel = "Guardar", isFavorite = false }: RecipeCardProps) {
  const [imageSrc, setImageSrc] = useState(recipe.image);
  const difficulty = difficultyConfig[recipe.difficulty];

  // Reset image source when recipe prop changes
  useEffect(() => {
    setImageSrc(recipe.image);
  }, [recipe.image]);

  // Fallback to placeholder if image fails to load
  function handleImageError() {
    if (imageSrc !== fallbackImage) {
      setImageSrc(fallbackImage);
    }
  }

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Recipe image with error handling */}
      <Box
        component="img"
        src={imageSrc}
        alt={recipe.name}
        onError={handleImageError}
        sx={{ width: "100%", height: 190, objectFit: "cover", display: "block" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Recipe title (clickable link to detail page) */}
        <Typography component={Link} href={`/recipes/${recipe.id}`} variant="h6" sx={{ fontWeight: 800 }}>
          {recipe.name}
        </Typography>
        {/* Short description */}
        <Typography color="text.secondary" sx={{ mt: 1 }} noWrap>
          {recipe.description}
        </Typography>
        {/* Recipe metadata: time and difficulty with dynamic colors */}
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap", gap: 1 }}>
          {/* Preparation time chip */}
          <Chip icon={<AccessTimeIcon />} label={`${recipe.preparationTime} min`} size="small" />
          {/* Difficulty chip: color changes based on level */}
          <Chip
            icon={<SignalCellularAltIcon />}
            label={difficulty.label}
            size="small"
            color={difficulty.color}
            sx={{ fontWeight: 700 }}
          />
          {/* Visual difficulty meter: 1-3 bars */}
          <Chip
            label={<DifficultyMeter difficulty={recipe.difficulty} />}
            size="small"
            sx={{
              bgcolor: "rgba(15, 23, 42, 0.04)",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              "& .MuiChip-label": { px: 1 },
            }}
          />
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
        {/* Link to recipe detail page */}
        <Button component={Link} href={`/recipes/${recipe.id}`} size="small">
          Ver receta
        </Button>
        {/* Favorite toggle button: red if favorited, primary if not */}
        {onFavorite ? (
          <Button
            size="small"
            color={isFavorite ? "error" : "primary"}
            startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={() => onFavorite(recipe.id)}
          >
            <Box component="span">{favoriteLabel}</Box>
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
}
