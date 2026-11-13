import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RecipeService } from '../../../../core/services/recipe.service';
import { UserService } from '../../../../core/services/user.service';
import { Recipe } from '../../../../core/models/recipe.model';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css'
})
export class RecipeDetail implements OnInit {
  recipe?: Recipe;
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipe = this.recipeService.getRecipeById(id);
    if (this.recipe) {
      this.isOwner = this.recipe.authorId === this.userService.currentUserValue.id;
    }
  }

  deleteRecipe(): void {
    if (!this.recipe) return;
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Potvrda brisanja recepta',
        message: `Da li ste sigurni da želite da obrišete recept "${this.recipe.title}"?`,
        confirmText: 'Obriši',
        cancelText: 'Otkaži'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && this.recipe) {
        this.recipeService.deleteRecipe(this.recipe.id);
        this.router.navigate(['/profile', this.userService.currentUserValue.username]);
      }
    });
  }
}
