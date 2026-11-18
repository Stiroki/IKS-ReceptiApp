import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './core/services/user.service';
import { User, UserRole } from './core/models/user.model';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private userService = inject(UserService);

  currentUser$: Observable<User>;

  constructor() {
    this.currentUser$ = this.userService.getCurrentUser();
  }

  onRoleChange(role: UserRole): void {
    this.userService.switchRole(role);
  }
}
