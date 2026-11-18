import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { RecipeService } from '../../../../core/services/recipe.service';
import { User } from '../../../../core/models/user.model';
import { Recipe } from '../../../../core/models/recipe.model';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private recipeService = inject(RecipeService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  profileUser?: User;
  userRecipes: Recipe[] = [];
  isOwnProfile = false;
  editMode = false;
  profileForm!: FormGroup;

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.userService.getCurrentUser(),
      this.recipeService.getRecipes()
    ]).subscribe(([params, currentUser, allRecipes]) => {
      const username = params.get('username') || currentUser.username;
      this.loadProfile(username, currentUser, allRecipes);
      this.cdr.markForCheck();
    });
  }

  loadProfile(username: string, currentUser: User, allRecipes: Recipe[]): void {
    this.profileUser = this.userService.getUserByUsername(username);
    this.isOwnProfile = this.profileUser?.id === currentUser.id;
    this.editMode = false;
    this.userRecipes = allRecipes.filter(r => r.authorUsername === username);

    if (this.profileUser) {
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
    this.cdr.markForCheck();
  }
}
