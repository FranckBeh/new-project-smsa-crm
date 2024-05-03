import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importez FormsModule
import { AppClientsComponent } from './clients.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClientsRoutingModule } from './clients.routing';
import { FormulaireClientComponent } from './formulaire-client/formulaire-client.component';
import { MaterialModule } from '../../material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, // Assurez-vous d'importer FormsModule ici
    HttpClientModule,
    NgxPaginationModule,
    MatPaginatorModule,
    ClientsRoutingModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppClientsComponent,
    FormulaireClientComponent
  ]
})
export class ClientModule { }
