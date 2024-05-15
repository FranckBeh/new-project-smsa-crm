
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppInvoiceComponent } from './invoice.component';
import { FormulaireFactureComponent } from './formulaire-facture/formulaire-facture.component';
import { EditFormulaireFactureComponent } from './edit-formulaire-facture/edit-formulaire-facture.component';
import { PreviewFactureComponent } from './preview-facture/preview-facture/preview-facture.component';

const routes: Routes = [
  {
    path: '',
    component: AppInvoiceComponent
  },
  {
    path: 'edit-formulaire-facture/:id',
    component: EditFormulaireFactureComponent,
},
  {
    path: 'formulaire-facture',
    component: FormulaireFactureComponent
  },
  { 
    path: 'preview-facture/:id', 
    component: PreviewFactureComponent 

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
