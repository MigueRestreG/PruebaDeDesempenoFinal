import { Schema, model, models, type InferSchemaType } from "mongoose";

const favoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  { timestamps: true },
);

favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export type FavoriteDocument = InferSchemaType<typeof favoriteSchema> & { _id: string };

export const FavoriteModel = models.Favorite || model("Favorite", favoriteSchema);
