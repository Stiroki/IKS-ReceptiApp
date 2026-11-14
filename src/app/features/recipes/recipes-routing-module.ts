import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeForm } from './pages/recipe-form/recipe-form';
import { RecipeDetail } from './pages/recipe-detail/recipe-detail';

const routes: Routes = [
  { path: 'new', component: RecipeForm },
  { path: ':id', component: RecipeDetail },
  { path: ':id/edit', component: RecipeForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {}
