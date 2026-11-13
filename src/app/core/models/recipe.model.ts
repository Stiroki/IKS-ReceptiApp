import { Allergen, RecipeIngredientItem } from './ingredient.model';

export type PreparationType =
  | 'KUVANJE'
  | 'PECENJE'
  | 'PRZENJE'
  | 'DINSTANJE'
  | 'GRILOVANJE'
  | 'POHOVANJE'
  | 'KUVANJE_NA_PARI'
  | 'BEZ_TERMICKE_OBRADE'
  | 'OSTALO';

export interface PreparationStep {
  stepNumber: number;
  title: string;
  description: string;
  imageUrl?: string;
  preparationType: PreparationType;
  durationMinutes?: number; // Obavezno za sve osim BEZ_TERMICKE_OBRADE i OSTALO
}

export interface RecipeOrigin {
  country?: string;
  region?: string;
  city?: string;
}

export interface Recipe {
  id: number;
  title: string;
  authorId: number;
  authorUsername: string;
  authorRegion?: string;
  mealTypes: string[];
  dishType: string;
  dietTypes: string[];
  allergens: Allergen[];
  servings: number;
  totalPrepTimeMinutes: number;
  mainImageUrl: string;
  videoUrl?: string;
  ingredients: RecipeIngredientItem[];
  steps: PreparationStep[];
  origin?: RecipeOrigin;
  story?: string;
  averageRating: number;
  ratingsCount: number;
  createdAt: string;
}
