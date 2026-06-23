// Recipe service: manages recipe CRUD and database fallback strategy
// Supports auto-seeding on empty DB and graceful fallback to demo data
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { RecipeModel, type RecipeDocument } from "@/models/recipe.model";
import type { Recipe } from "@/types";
import { demoRecipes } from "@/lib/demo-recipes";

// Normalize curry image URL (distinct from salad to ensure visual variety)
const correctedCurryImage =
  "https://images.pexels.com/photos/9345658/pexels-photo-9345658.jpeg?cs=srgb&dl=pexels-anna-pou-9345658.jpg&fm=jpg";

// Normalize recipe data: apply visual corrections (e.g., consistent curry image)
function normalizeRecipe(recipe: Recipe): Recipe {
  if (recipe.name === "Curry de garbanzos") {
    return {
      ...recipe,
      image: correctedCurryImage,
    };
  }

  return recipe;
}

// Convert Mongoose document to app Recipe type (exclude schema metadata)
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

// Fetch all recipes from DB with fallback to demo data if connection fails
// Auto-seeds DB with demo recipes on first run (empty collection)
export async function getRecipes(): Promise<Recipe[]> {
  try {
    await connectToDatabase();
    const recipes = await RecipeModel.find().sort({ name: 1 }).lean<RecipeDocument[]>();
    // Auto-seed if database is empty (first run or reset)
    if (recipes.length === 0) {
      await RecipeModel.insertMany(
        demoRecipes.map(({ id: _id, ...recipe }) => recipe),
      );

      const seededRecipes = await RecipeModel.find().sort({ name: 1 }).lean<RecipeDocument[]>();
      return seededRecipes.map((recipe) => normalizeRecipe(serializeRecipe(recipe)));
    }

    // Update curry image for consistency (idempotent operation)
    await RecipeModel.updateOne(
      { name: "Curry de garbanzos" },
      { $set: { image: correctedCurryImage } },
    );

    return recipes.map((recipe) => normalizeRecipe(serializeRecipe(recipe)));
  } catch {
    // Graceful fallback: return demo recipes if DB unavailable
    return demoRecipes.map(normalizeRecipe);
  }
}

// Fetch single recipe by ObjectId or fallback to demo data by id string
// Validates ObjectId format before querying MongoDB
export async function getRecipeById(id: string): Promise<Recipe | null> {
  // Check demo data first if id is not valid MongoDB ObjectId format
  if (!isValidObjectId(id)) {
    return demoRecipes.map(normalizeRecipe).find((recipe) => recipe.id === id) ?? null;
  }

  try {
    await connectToDatabase();
    const recipe = await RecipeModel.findById(id).lean<RecipeDocument | null>();
    // Return from DB if found, otherwise fallback to demo data
    return recipe ? normalizeRecipe(serializeRecipe(recipe)) : demoRecipes.map(normalizeRecipe).find((item) => item.id === id) ?? null;
  } catch {
    // DB error: fallback to demo data
    return demoRecipes.map(normalizeRecipe).find((recipe) => recipe.id === id) ?? null;
  }
}

// Replace entire recipes collection (used by seed script)
// Deletes all existing recipes and inserts new batch
export async function replaceRecipes(recipes: Omit<Recipe, "id">[]) {
  await connectToDatabase();
  await RecipeModel.deleteMany({});
  return RecipeModel.insertMany(recipes);
}
