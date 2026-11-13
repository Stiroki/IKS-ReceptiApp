import { Component } from '@angular/core';
import { UserService } from './core/services/user.service';
import { User, UserRole } from './core/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  currentUser$: Observable<User>;

  constructor(private userService: UserService) {
    this.currentUser$ = this.userService.getCurrentUser();
  }

  onRoleChange(role: UserRole): void {
    this.userService.switchRole(role);
  }
}
