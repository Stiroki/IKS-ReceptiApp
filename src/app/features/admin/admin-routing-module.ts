import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogManagement } from './pages/catalog-management/catalog-management';

const routes: Routes = [
  { path: '', component: CatalogManagement }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
