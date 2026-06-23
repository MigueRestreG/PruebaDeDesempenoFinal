// Recipe collection schema with full cooking instructions
// Includes extended fields (ingredients, steps) that differentiate from card view
import { Schema, model, models, type InferSchemaType } from "mongoose";

const recipeSchema = new Schema(
  {
    // Recipe metadata
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, // External URL or local path
    // Cooking data: ingredients and step-by-step instructions
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    servings: { type: Number, required: true },
    // Preparation time in minutes (displayed on cards)
    preparationTime: { type: Number, required: true },
    // Difficulty level with visual indicators: Fácil (1 bar) | Media (2 bars) | Difícil (3 bars)
    difficulty: { type: String, enum: ["Facil", "Media", "Dificil"], required: true },
  },
  { timestamps: true },
);

export type RecipeDocument = InferSchemaType<typeof recipeSchema> & { _id: string };

export const RecipeModel = models.Recipe || model("Recipe", recipeSchema);
