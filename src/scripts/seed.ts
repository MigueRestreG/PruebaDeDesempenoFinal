import { existsSync, readFileSync } from "node:fs";
import { connectToDatabase } from "@/lib/mongodb";
import { replaceRecipes } from "@/services/recipe.service";

function loadEnvFile(filePath: string) {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith("#") || !trimmedLine.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmedLine.split("=");
    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = valueParts.join("=").trim();
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const recipes = [
  {
    name: "Tacos de pollo",
    description: "Tacos jugosos con salsa fresca.",
    image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1200&q=80",
    ingredients: ["Tortillas", "Pollo", "Cebolla", "Cilantro", "Limón"],
    steps: ["Cocina el pollo.", "Calienta las tortillas.", "Sirve con cebolla, cilantro y limón."],
    servings: 4,
    preparationTime: 25,
    difficulty: "Facil" as const,
  },
  {
    name: "Pasta cremosa",
    description: "Pasta con salsa cremosa y queso.",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d7ef?auto=format&fit=crop&w=1200&q=80",
    ingredients: ["Pasta", "Crema", "Queso", "Ajo"],
    steps: ["Cuece la pasta.", "Prepara la salsa.", "Mezcla y sirve caliente."],
    servings: 2,
    preparationTime: 20,
    difficulty: "Facil" as const,
  },
  {
    name: "Ensalada mediterránea",
    description: "Fresca, ligera y llena de color.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    ingredients: ["Lechuga", "Tomate", "Pepino", "Aceitunas", "Queso feta"],
    steps: ["Lava y corta las verduras.", "Añade el queso y las aceitunas.", "Aliña al gusto."],
    servings: 2,
    preparationTime: 15,
    difficulty: "Facil" as const,
  },
  {
    name: "Salmón al horno",
    description: "Salmón con hierbas y limón.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    ingredients: ["Salmón", "Limón", "Romero", "Aceite de oliva"],
    steps: ["Precalienta el horno.", "Sazona el salmón.", "Hornea hasta que esté listo."],
    servings: 2,
    preparationTime: 30,
    difficulty: "Media" as const,
  },
  {
    name: "Hamburguesa casera",
    description: "Hamburguesa completa con pan suave.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    ingredients: ["Carne molida", "Pan", "Lechuga", "Tomate", "Queso"],
    steps: ["Forma las hamburguesas.", "Cocina la carne.", "Arma con los ingredientes."],
    servings: 2,
    preparationTime: 25,
    difficulty: "Facil" as const,
  },
  {
    name: "Lasaña vegetariana",
    description: "Capas de verduras y salsa bechamel.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
    ingredients: ["Láminas de lasaña", "Calabacín", "Berenjena", "Tomate", "Bechamel"],
    steps: ["Saltea las verduras.", "Arma las capas.", "Hornea hasta gratinar."],
    servings: 6,
    preparationTime: 50,
    difficulty: "Media" as const,
  },
  {
    name: "Panqueques",
    description: "Desayuno dulce y esponjoso.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    ingredients: ["Harina", "Huevo", "Leche", "Mantequilla"],
    steps: ["Mezcla los ingredientes.", "Cocina porciones pequeñas.", "Sirve con fruta o miel."],
    servings: 3,
    preparationTime: 18,
    difficulty: "Facil" as const,
  },
  {
    name: "Curry de garbanzos",
    description: "Curry aromático y muy nutritivo.",
    image: "https://images.pexels.com/photos/9345658/pexels-photo-9345658.jpeg?cs=srgb&dl=pexels-anna-pou-9345658.jpg&fm=jpg",
    ingredients: ["Garbanzos", "Leche de coco", "Curry", "Cebolla", "Ajo"],
    steps: ["Sofríe la cebolla y el ajo.", "Agrega el curry y los garbanzos.", "Incorpora la leche de coco y cocina."],
    servings: 4,
    preparationTime: 35,
    difficulty: "Media" as const,
  },
  {
    name: "Risotto de champiñones",
    description: "Cremoso y profundo en sabor.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80",
    ingredients: ["Arroz arborio", "Champiñones", "Caldo", "Queso parmesano"],
    steps: ["Sofríe los champiñones.", "Añade el arroz y el caldo poco a poco.", "Termina con parmesano."],
    servings: 4,
    preparationTime: 40,
    difficulty: "Dificil" as const,
  },
  {
    name: "Bowl de quinoa",
    description: "Bowl balanceado con vegetales y proteína.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    ingredients: ["Quinoa", "Aguacate", "Zanahoria", "Huevo", "Espinaca"],
    steps: ["Cuece la quinoa.", "Prepara los vegetales.", "Sirve todo en un bowl y aliña."],
    servings: 2,
    preparationTime: 22,
    difficulty: "Facil" as const,
  },
];

async function main() {
  await connectToDatabase();
  await replaceRecipes(recipes);
  console.log(`Seed completado con ${recipes.length} recetas.`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});