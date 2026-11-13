import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { CatalogManagement } from './pages/catalog-management/catalog-management';
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '', component: CatalogManagement },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home-module').then(m => m.HomeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile-module').then(m => m.ProfileModule)
  },
  {
    path: 'recipes',
    loadChildren: () => import('./features/recipes/recipes-module').then(m => m.RecipesModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search-module').then(m => m.SearchModule)
  },
  {
    path: 'pantry',
    canActivate: [authGuard],
    loadChildren: () => import('./features/pantry/pantry-module').then(m => m.PantryModule)
  },
  {
    path: 'shopping-lists',
    canActivate: [authGuard],
    loadChildren: () => import('./features/shopping-list/shopping-list-module').then(m => m.ShoppingListModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./features/map/map-module').then(m => m.MapModule)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadChildren: () => import('./features/notifications/notifications-module').then(m => m.NotificationsModule)
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
