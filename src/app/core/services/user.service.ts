import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_KEY = 'kt1_users';
  private readonly ACTIVE_USER_KEY = 'kt1_active_user_id';
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private initialUsers: User[] = [
    {
      id: 1,
      username: 'milana_chef',
      email: 'milana@ftn.uns.ac.rs',
      role: 'ADMIN',
      profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      region: 'Vojvodina, Srbija',
      bio: 'Ljubitelj domaće kuhinje i brzih recepata.',
      publishedRecipesCount: 2
    },
    {
      id: 2,
      username: 'marko_kuvar',
      email: 'marko@ftn.uns.ac.rs',
      role: 'USER',
      profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      region: 'Šumadija, Srbija',
      bio: 'Tradicionalna jela i specijaliteti sa roštilja.',
      publishedRecipesCount: 1
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.loadUsers());
  private currentUserSubject = new BehaviorSubject<User>(this.loadActiveUser());

  private loadUsers(): User[] {
    if (!this.isBrowser) return this.initialUsers;
    const saved = window.localStorage.getItem(this.USERS_KEY);
    if (!saved) return this.initialUsers;

    const parsed: User[] = JSON.parse(saved);
    // Osiguravamo da oba test korisnika uvek postoje
    const merged = [...parsed];
    for (const defUser of this.initialUsers) {
      if (!merged.some(u => u.id === defUser.id)) {
        merged.push(defUser);
      }
    }
    return merged;
  }

  private loadActiveUser(): User {
    const users = this.usersSubject.value;
    if (!this.isBrowser) return users[0];
    const savedId = Number(window.localStorage.getItem(this.ACTIVE_USER_KEY));
    return users.find(u => u.id === savedId) || users[0];
  }

  private saveUsers(users: User[]): void {
    if (this.isBrowser) {
      window.localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
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

  toggleActiveUser(): void {
    const users = this.usersSubject.value;
    const currentIndex = users.findIndex(u => u.id === this.currentUserSubject.value.id);
    const nextUser = users[(currentIndex + 1) % users.length];

    if (this.isBrowser) {
      window.localStorage.setItem(this.ACTIVE_USER_KEY, String(nextUser.id));
    }
    this.currentUserSubject.next({ ...nextUser });
  }

  switchRole(role: UserRole): void {
    const updated = { ...this.currentUserSubject.value, role };
    const users = this.usersSubject.value.map(u => (u.id === updated.id ? updated : u));
    this.saveUsers(users);
    this.currentUserSubject.next(updated);
  }

  // Izmena sopstvenog profila (slika, biografija, region)
  updateProfile(userId: number, changes: { profileImageUrl?: string; bio?: string; region?: string }): void {
    const users = this.usersSubject.value.map(u =>
      u.id === userId ? { ...u, ...changes } : u
    );
    this.saveUsers(users);

    if (this.currentUserSubject.value.id === userId) {
      const updatedCurrent = users.find(u => u.id === userId);
      if (updatedCurrent) {
        this.currentUserSubject.next({ ...updatedCurrent });
      }
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
