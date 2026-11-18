import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { Recipe } from '../../../../core/models/recipe.model';
import { Ingredient } from '../../../../core/models/ingredient.model';
import { User } from '../../../../core/models/user.model';
import { PantryRecipeMatch, RecipeService } from '../../../../core/services/recipe.service';
import { CatalogService } from '../../../../core/services/catalog.service';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  selectedTabIndex = 0;
  maxMissingIngredients = 0;

  currentUser$!: Observable<User>;
  allIngredients$!: Observable<Ingredient[]>;
  pantryIds$!: Observable<number[]>;

  popularRecipes$!: Observable<Recipe[]>;
  latestRecipes$!: Observable<Recipe[]>;
  pantryMatches$!: Observable<PantryRecipeMatch[]>;

  private maxMissingSubject$ = new Observable<number>();

  constructor(
    private recipeService: RecipeService,
    private catalogService: CatalogService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.userService.getCurrentUser();
    this.allIngredients$ = this.catalogService.getIngredients();
    this.pantryIds$ = this.recipeService.getPantryIngredientIds();

    const recipes$ = this.recipeService.getRecipes();

    this.popularRecipes$ = recipes$.pipe(
      map(recipes => this.recipeService.getPopularRecipesLast30Days(recipes))
    );

    this.latestRecipes$ = recipes$.pipe(
      map(recipes => this.recipeService.getLatestRecipes(recipes))
    );

    this.updatePantryMatchesStream();
  }

  updatePantryMatchesStream(): void {
    this.pantryMatches$ = combineLatest([
      this.recipeService.getRecipes(),
      this.recipeService.getPantryIngredientIds()
    ]).pipe(
      map(([recipes, pantryIds]) =>
        this.recipeService.getRecipesByAvailableIngredients(
          recipes,
          pantryIds,
          this.maxMissingIngredients
        )
      )
    );
  }

  onToggleIngredient(ingredientId: number): void {
    this.recipeService.togglePantryIngredient(ingredientId);
  }

  onMaxMissingChange(value: number): void {
    this.maxMissingIngredients = value;
    this.updatePantryMatchesStream();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}