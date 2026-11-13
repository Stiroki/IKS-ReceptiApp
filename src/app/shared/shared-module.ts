import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { RecipeCard } from './components/recipe-card/recipe-card';

@NgModule({
  declarations: [ConfirmDialog, RecipeCard],
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule
  ],
  exports: [ConfirmDialog, RecipeCard]
})
export class SharedModule {}
