import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly STORAGE_KEY = 'kt1_users';

  private initialUsers: User[] = [
    {
      id: 1,
      username: 'milana_chef',
      email: 'milana@gmail.com',
      role: 'ADMIN',
      profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      region: 'Vojvodina, Srbija',
      bio: 'Ljubitelj domaće kuhinje i brzih recepata.',
      publishedRecipesCount: 2
    },
    {
      id: 2,
      username: 'marko_kuvar',
      email: 'marko@gmail.com',
      role: 'USER',
      profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      region: 'Šumadija, Srbija',
      bio: 'Tradicionalna jela i specijaliteti sa roštilja.',
      publishedRecipesCount: 1
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.loadUsers());
  private currentUserSubject = new BehaviorSubject<User>(this.usersSubject.value[0]);

  private loadUsers(): User[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : this.initialUsers;
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    this.usersSubject.next(users);
  }

  getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }

  get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  getUserByUsername(username: string): User | undefined {
    return this.usersSubject.value.find(u => u.username === username);
  }

  switchRole(role: UserRole): void {
    const updated = { ...this.currentUserSubject.value, role };
    this.currentUserSubject.next(updated);
  }

  // Stavka 2: Menjaju se samo slika, biografija i region (username ostaje nepromenjen)
  updateProfile(userId: number, changes: { profileImageUrl?: string; bio?: string; region?: string }): void {
    const users = this.usersSubject.value.map(u =>
      u.id === userId ? { ...u, ...changes } : u
    );
    this.saveUsers(users);

    if (this.currentUserSubject.value.id === userId) {
      const updatedCurrent = users.find(u => u.id === userId)!;
      this.currentUserSubject.next(updatedCurrent);
    }
  }

  updateRecipeCount(userId: number, count: number): void {
    const users = this.usersSubject.value.map(u =>
      u.id === userId ? { ...u, publishedRecipesCount: count } : u
    );
    this.saveUsers(users);
    if (this.currentUserSubject.value.id === userId) {
      this.currentUserSubject.next({ ...this.currentUserSubject.value, publishedRecipesCount: count });
    }
  }
}
