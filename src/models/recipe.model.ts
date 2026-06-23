import { Schema, model, models, type InferSchemaType } from "mongoose";

const recipeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    servings: { type: Number, required: true },
    preparationTime: { type: Number, required: true },
    difficulty: { type: String, enum: ["Facil", "Media", "Dificil"], required: true },
  },
  { timestamps: true },
);

export type RecipeDocument = InferSchemaType<typeof recipeSchema> & { _id: string };

export const RecipeModel = models.Recipe || model("Recipe", recipeSchema);
