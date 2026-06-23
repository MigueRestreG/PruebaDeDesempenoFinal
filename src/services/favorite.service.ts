// Favorite service: manages user recipe preferences
// Implements many-to-many relationships with automatic recipe population
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { FavoriteModel, type FavoriteDocument } from "@/models/favorite.model";
import { RecipeModel, type RecipeDocument } from "@/models/recipe.model";
import type { Favorite, Recipe } from "@/types";

// Convert Mongoose recipe document to app Recipe type
function serializeRecipe(recipe: RecipeDocument): Recipe {
  return {
    id: recipe._id.toString(),
    name: recipe.name,
    description: recipe.description,
    image: recipe.image,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    servings: recipe.servings,
    preparationTime: recipe.preparationTime,
    difficulty: recipe.difficulty,
  };
}

// Fetch user's favorites with recipe data populated
// Performs join between Favorites and Recipes collections (manual population)
export async function getFavoritesByUser(userId: string): Promise<Favorite[]> {
  await connectToDatabase();
  // Query all favorites for this user
  const favorites = await FavoriteModel.find({ userId }).lean<FavoriteDocument[]>();
  const recipeIds = favorites.map((favorite) => favorite.recipeId);
  // Batch query recipes to avoid N+1 problem
  const recipes = await RecipeModel.find({ _id: { $in: recipeIds } }).lean<RecipeDocument[]>();
  // Build lookup map for O(1) recipe resolution
  const recipeMap = new Map(recipes.map((recipe) => [recipe._id.toString(), serializeRecipe(recipe)]));

  // Return favorites with associated recipe data
  return favorites.map((favorite) => ({
    id: favorite._id.toString(),
    userId: favorite.userId.toString(),
    recipeId: favorite.recipeId.toString(),
    recipe: recipeMap.get(favorite.recipeId.toString()),
  }));
}

// Add recipe to user's favorites (idempotent: upsert prevents duplicates)
export async function addFavorite(userId: string, recipeId: string): Promise<Favorite> {
  // Validate recipeId is a valid MongoDB ObjectId
  if (!isValidObjectId(recipeId)) {
    throw new Error("Receta invalida.");
  }

  await connectToDatabase();
  // Verify recipe exists before saving favorite
  const recipe = await RecipeModel.findById(recipeId).lean<RecipeDocument | null>();
  if (!recipe) {
    throw new Error("La receta no existe.");
  }

  // Upsert: create if new, update if exists (prevents duplicates)
  const favorite = await FavoriteModel.findOneAndUpdate(
    { userId, recipeId },
    { userId, recipeId },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean<FavoriteDocument>();

  if (!favorite) {
    throw new Error("No se pudo guardar el favorito.");
  }

  return {
    id: favorite._id.toString(),
    userId: favorite.userId.toString(),
    recipeId: favorite.recipeId.toString(),
    recipe: serializeRecipe(recipe),
  };
}

// Remove favorite by favorite document ID (not recipe ID)
// Validates both favoriteId and userId to prevent unauthorized deletions
export async function removeFavorite(userId: string, favoriteId: string): Promise<boolean> {
  if (!isValidObjectId(favoriteId)) {
    return false;
  }

  await connectToDatabase();
  // Delete only if favorite belongs to authenticated user (security check)
  const result = await FavoriteModel.deleteOne({ _id: favoriteId, userId });
  return result.deletedCount === 1;
}
