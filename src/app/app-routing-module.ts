import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';

const routes: Routes = [
  { path: '', redirectTo: 'profile/milana_chef', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./features/home/home-module').then(m => m.HomeModule)
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
    loadChildren: () => import('./features/pantry/pantry-module').then(m => m.PantryModule)
  },
  {
    path: 'shopping-lists',
    loadChildren: () => import('./features/shopping-list/shopping-list-module').then(m => m.ShoppingListModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./features/map/map-module').then(m => m.MapModule)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./features/notifications/notifications-module').then(m => m.NotificationsModule)
  },
  { path: '**', redirectTo: 'profile/milana_chef' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
