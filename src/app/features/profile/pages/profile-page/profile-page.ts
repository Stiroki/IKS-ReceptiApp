import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { RecipeService } from '../../../../core/services/recipe.service';
import { User } from '../../../../core/models/user.model';
import { Recipe } from '../../../../core/models/recipe.model';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit {
  profileUser?: User;
  userRecipes: Recipe[] = [];
  isOwnProfile = false;
  editMode = false;
  profileForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private recipeService: RecipeService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username') || this.userService.currentUserValue.username;
      this.loadProfile(username);
    });
  }

  loadProfile(username: string): void {
    this.profileUser = this.userService.getUserByUsername(username);
    const current = this.userService.currentUserValue;
    this.isOwnProfile = this.profileUser?.id === current.id;

    if (this.profileUser) {
      this.userRecipes = this.recipeService.getRecipesByAuthor(this.profileUser.username);
      this.profileForm = this.fb.group({
        profileImageUrl: [this.profileUser.profileImageUrl || '', Validators.required],
        region: [this.profileUser.region || '', Validators.required],
        bio: [this.profileUser.bio || '']
      });
    }
  }

  saveProfile(): void {
    if (!this.profileUser || this.profileForm.invalid) return;
    this.userService.updateProfile(this.profileUser.id, this.profileForm.value);
    this.editMode = false;
    this.loadProfile(this.profileUser.username);
  }

  onEditRecipe(recipeId: number): void {
    this.router.navigate(['/recipes', recipeId, 'edit']);
  }

  onDeleteRecipe(recipeId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Potvrda brisanja recepta',
        message: 'Da li ste sigurni da želite trajno da obrišete ovaj recept?',
        confirmText: 'Obriši recept',
        cancelText: 'Odustani'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && this.profileUser) {
        this.recipeService.deleteRecipe(recipeId);
        this.loadProfile(this.profileUser.username);
      }
    });
  }
}
