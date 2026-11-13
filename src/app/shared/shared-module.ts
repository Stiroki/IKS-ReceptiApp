import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeCard } from './components/recipe-card/recipe-card';
import { IngredientPicker } from './components/ingredient-picker/ingredient-picker';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';

@NgModule({
  declarations: [RecipeCard, IngredientPicker, ConfirmDialog],
  imports: [CommonModule],
  exports: [RecipeCard, IngredientPicker, ConfirmDialog],
})
export class SharedModule {}
