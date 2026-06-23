import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { RecipeModel, type RecipeDocument } from "@/models/recipe.model";
import type { Recipe } from "@/types";
import { demoRecipes } from "@/lib/demo-recipes";

const correctedCurryImage =
  "https://images.pexels.com/photos/9345658/pexels-photo-9345658.jpeg?cs=srgb&dl=pexels-anna-pou-9345658.jpg&fm=jpg";

function normalizeRecipe(recipe: Recipe): Recipe {
  if (recipe.name === "Curry de garbanzos") {
    return {
      ...recipe,
      image: correctedCurryImage,
    };
  }

  return recipe;
}

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

export async function getRecipes(): Promise<Recipe[]> {
  try {
    await connectToDatabase();
    const recipes = await RecipeModel.find().sort({ name: 1 }).lean<RecipeDocument[]>();
    if (recipes.length === 0) {
      await RecipeModel.insertMany(
        demoRecipes.map(({ id: _id, ...recipe }) => recipe),
      );

      const seededRecipes = await RecipeModel.find().sort({ name: 1 }).lean<RecipeDocument[]>();
      return seededRecipes.map((recipe) => normalizeRecipe(serializeRecipe(recipe)));
    }

    await RecipeModel.updateOne(
      { name: "Curry de garbanzos" },
      { $set: { image: correctedCurryImage } },
    );

    return recipes.map((recipe) => normalizeRecipe(serializeRecipe(recipe)));
  } catch {
    return demoRecipes.map(normalizeRecipe);
  }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  if (!isValidObjectId(id)) {
    return demoRecipes.map(normalizeRecipe).find((recipe) => recipe.id === id) ?? null;
  }

  try {
    await connectToDatabase();
    const recipe = await RecipeModel.findById(id).lean<RecipeDocument | null>();
    return recipe ? normalizeRecipe(serializeRecipe(recipe)) : demoRecipes.map(normalizeRecipe).find((item) => item.id === id) ?? null;
  } catch {
    return demoRecipes.map(normalizeRecipe).find((recipe) => recipe.id === id) ?? null;
  }
}

export async function replaceRecipes(recipes: Omit<Recipe, "id">[]) {
  await connectToDatabase();
  await RecipeModel.deleteMany({});
  return RecipeModel.insertMany(recipes);
}
