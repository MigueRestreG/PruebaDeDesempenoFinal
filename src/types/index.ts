export type Difficulty = "Facil" | "Media" | "Dificil";

export type Recipe = {
  id: string;
  name: string;
  description: string;
  image: string;
  ingredients: string[];
  steps: string[];
  servings: number;
  preparationTime: number;
  difficulty: Difficulty;
};

export type UserSession = {
  id: string;
  name: string;
  lastName: string;
  email: string;
};

export type Favorite = {
  id: string;
  userId: string;
  recipeId: string;
  recipe?: Recipe;
};
