import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { HomeRoutingModule } from './home-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { HomePage } from './pages/home-page/home-page';

@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule
  ],
})
export class HomeModule {}