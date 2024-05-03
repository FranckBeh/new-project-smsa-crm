import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppCartesVisitesComponent } from './cartes-visites.component';

const routes: Routes = [
  {
    path: '',
    component: AppCartesVisitesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})



export class CartesVisitesRoutingModule {}
