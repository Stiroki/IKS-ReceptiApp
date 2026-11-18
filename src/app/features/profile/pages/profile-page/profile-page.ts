import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private recipeService = inject(RecipeService);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);

  profileUser?: User;
  isOwnProfile = false;
  editMode = false;
  profileForm!: FormGroup;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const username = params.get('username') || this.userService.currentUserValue.username;
      this.loadProfile(username);
    });
  }

  loadProfile(username: string, currentUser: User): void {
    this.profileUser = this.userService.getUserByUsername(username);
    this.isOwnProfile = this.profileUser?.id === currentUser.id;
    this.editMode = false;

    if (this.profileUser) {
      this.profileForm = this.fb.group({
        profileImageUrl: [this.profileUser.profileImageUrl || '', Validators.required],
        region: [this.profileUser.region || '', Validators.required],
        bio: [this.profileUser.bio || ''],
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
        cancelText: 'Odustani',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed && this.profileUser) {
        this.recipeService.deleteRecipe(recipeId);
        this.loadProfile(this.profileUser.username);
      }
    });
  }
}
