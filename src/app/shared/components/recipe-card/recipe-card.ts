import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: false,
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css'
})
export class RecipeCard {
  @Input({ required: true }) recipe!: Recipe;
  @Input() showOwnerActions = false;

  @Output() editClicked = new EventEmitter<number>();
  @Output() deleteClicked = new EventEmitter<number>();
}
