import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './core/services/user.service';
import { User, UserRole } from './core/models/user.model';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private userService = inject(UserService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentUser$: Observable<User>;

  constructor() {
    this.currentUser$ = this.userService.getCurrentUser();
  }

  toggleUser(): void {
    this.userService.toggleActiveUser();
    this.cdr.markForCheck();
  }

  toggleRole(currentRole: UserRole): void {
    const nextRole: UserRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    this.userService.switchRole(nextRole);
    if (nextRole !== 'ADMIN' && this.router.url.startsWith('/admin')) {
      this.router.navigate(['/profile', this.userService.currentUserValue.username]);
    }
    this.cdr.markForCheck();
  }
}
