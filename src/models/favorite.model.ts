// Favorite collection schema linking users to recipes
// Many-to-many junction table with compound unique index
import { Schema, model, models, type InferSchemaType } from "mongoose";

const favoriteSchema = new Schema(
  {
    // References to User and Recipe documents
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  { timestamps: true },
);

// Compound unique index prevents duplicate favorites per user per recipe
favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export type FavoriteDocument = InferSchemaType<typeof favoriteSchema> & { _id: string };

export const FavoriteModel = models.Favorite || model("Favorite", favoriteSchema);
