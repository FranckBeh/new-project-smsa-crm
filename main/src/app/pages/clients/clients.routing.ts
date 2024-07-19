
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppClientsComponent } from './clients.component';
import { FormulaireClientComponent } from './formulaire-client/formulaire-client.component';
import { FormulaireRequestsComponent } from '../requests/add-requests/formulaire-requests/formulaire-requests.component';

const routes: Routes = [
  {
    path: '',
    component: AppClientsComponent
  },
  {
    path: 'formulaire-client',
    component: FormulaireClientComponent
  },
  { path: 'formulaire-client/:id', component: FormulaireClientComponent },
  { path: 'requests/add-requests/formulaire-requests/:id', component: FormulaireRequestsComponent  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
