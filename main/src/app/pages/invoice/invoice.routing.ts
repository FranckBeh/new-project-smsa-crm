
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppInvoiceComponent } from './invoice.component';
import { FormulaireFactureComponent } from './formulaire-facture/formulaire-facture.component';

const routes: Routes = [
  {
    path: '',
    component: AppInvoiceComponent
  },
  {
    path: 'formulaire-facture',
    component: FormulaireFactureComponent
  },
  {
    path: 'create-invoice', // Assurez-vous que le chemin correspond à celui utilisé dans la navigation
    component: FormulaireFactureComponent // Composant de création de facture
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
