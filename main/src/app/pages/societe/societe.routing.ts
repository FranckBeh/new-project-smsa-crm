
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppSocieteComponent } from './societe.component';
import { FormulaireSocieteComponent } from './formulaire-societe/formulaire-societe.component';

const routes: Routes = [
  {
    path: '',
    component: AppSocieteComponent

  },
  {
    path: 'formulaire-societe',
    component: FormulaireSocieteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocieteRoutingModule { }
