
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppClientsComponent } from './clients.component';
import { FormulaireClientComponent } from './formulaire-client/formulaire-client.component';

const routes: Routes = [
  {
    path: '',
    component: AppClientsComponent
  },
  {
    path: 'formulaire-client',
    component: FormulaireClientComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
