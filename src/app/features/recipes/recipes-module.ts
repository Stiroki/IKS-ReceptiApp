import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing-module';
import { RecipeForm } from './pages/recipe-form/recipe-form';
import { RecipeDetail } from './pages/recipe-detail/recipe-detail';
import { StepBuilder } from './components/step-builder/step-builder';

@NgModule({
  declarations: [RecipeForm, RecipeDetail, StepBuilder],
  imports: [CommonModule, RecipesRoutingModule],
})
export class RecipesModule {}
