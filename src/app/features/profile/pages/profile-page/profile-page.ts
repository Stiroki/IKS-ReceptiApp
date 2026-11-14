import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css'
})
export class ProfilePage implements OnInit {
  profileUser?: User;
  isOwnProfile = false;
  editMode = false;
  profileForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.userService.getCurrentUser()]).subscribe(
      ([params, currentUser]) => {
        const username = params.get('username') || currentUser.username;
        this.loadProfile(username, currentUser);
        this.cdr.markForCheck();
      }
    );
  }

  loadProfile(username: string, currentUser: User): void {
    this.profileUser = this.userService.getUserByUsername(username);
    this.isOwnProfile = this.profileUser?.id === currentUser.id;
    this.editMode = false;

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
    this.loadProfile(this.profileUser.username, this.userService.currentUserValue);
    this.cdr.markForCheck();
  }
}
