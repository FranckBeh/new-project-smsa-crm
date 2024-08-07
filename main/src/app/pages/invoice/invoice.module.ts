import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';



// Ajoutez les modules pour la pagination et l'exportation
import { ExportAsModule } from 'ngx-export-as';

import { AppInvoiceComponent } from './invoice.component';
import { InvoiceRoutingModule } from './invoice.routing';
import { FormulaireFactureComponent } from './formulaire-facture/formulaire-facture.component';
import { EditFormulaireFactureComponent } from './edit-formulaire-facture/edit-formulaire-facture.component';
import { PreviewFactureComponent } from './preview-facture/preview-facture/preview-facture.component';
import { PaymentModalComponent } from './modal/payment-modal/payment-modal.component';

@NgModule({
  imports: [
    CommonModule,

    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    FormsModule,
    MatIconModule,
    MatTabsModule,
    InvoiceRoutingModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
   //PaginationModule.forRoot(), // Importez le module de pagination ngx-bootstrap
    ExportAsModule, // Importez le module d'exportation ngx-export-as
    MatDialogModule
  ],
  declarations: [
    AppInvoiceComponent,
    EditFormulaireFactureComponent,
    FormulaireFactureComponent,
    PreviewFactureComponent,
    PaymentModalComponent,
  ]
})
export class InvoiceModule { }
