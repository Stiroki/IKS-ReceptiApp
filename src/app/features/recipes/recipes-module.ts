import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { RecipesRoutingModule } from './recipes-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { RecipeForm } from './pages/recipe-form/recipe-form';
import { RecipeDetail } from './pages/recipe-detail/recipe-detail';

@NgModule({
  declarations: [RecipeForm, RecipeDetail],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecipesRoutingModule,
    SharedModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatDialogModule
  ]
})
export class RecipesModule {}
