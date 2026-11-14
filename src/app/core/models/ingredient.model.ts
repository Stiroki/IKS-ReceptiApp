export interface Allergen {
  id: number;
  name: string;
}

export interface IngredientCategory {
  id: number;
  name: string;
}

export interface Ingredient {
  id: number;
  name: string;
  category: IngredientCategory;
  defaultUnit: string;
  isBranded: boolean;
  brandName?: string;
  allergens: Allergen[];
}

export interface RecipeIngredientItem {
  ingredient: Ingredient;
  amount?: number;
  unit: string;
}
