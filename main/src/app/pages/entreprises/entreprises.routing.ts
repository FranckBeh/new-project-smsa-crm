import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntrepriseComponent } from './entreprises.component';

const routes: Routes = [
  {
    path: '',
    component: EntrepriseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EntreprisesRoutingModule { }