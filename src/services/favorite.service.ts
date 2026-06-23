import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { FavoriteModel, type FavoriteDocument } from "@/models/favorite.model";
import { RecipeModel, type RecipeDocument } from "@/models/recipe.model";
import type { Favorite, Recipe } from "@/types";

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

export async function getFavoritesByUser(userId: string): Promise<Favorite[]> {
  await connectToDatabase();
  const favorites = await FavoriteModel.find({ userId }).lean<FavoriteDocument[]>();
  const recipeIds = favorites.map((favorite) => favorite.recipeId);
  const recipes = await RecipeModel.find({ _id: { $in: recipeIds } }).lean<RecipeDocument[]>();
  const recipeMap = new Map(recipes.map((recipe) => [recipe._id.toString(), serializeRecipe(recipe)]));

  return favorites.map((favorite) => ({
    id: favorite._id.toString(),
    userId: favorite.userId.toString(),
    recipeId: favorite.recipeId.toString(),
    recipe: recipeMap.get(favorite.recipeId.toString()),
  }));
}

export async function addFavorite(userId: string, recipeId: string): Promise<Favorite> {
  if (!isValidObjectId(recipeId)) {
    throw new Error("Receta invalida.");
  }

  await connectToDatabase();
  const recipe = await RecipeModel.findById(recipeId).lean<RecipeDocument | null>();
  if (!recipe) {
    throw new Error("La receta no existe.");
  }

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

export async function removeFavorite(userId: string, favoriteId: string): Promise<boolean> {
  if (!isValidObjectId(favoriteId)) {
    return false;
  }

  await connectToDatabase();
  const result = await FavoriteModel.deleteOne({ _id: favoriteId, userId });
  return result.deletedCount === 1;
}
