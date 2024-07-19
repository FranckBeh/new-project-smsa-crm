import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppPrestatairesComponent } from './prestataires.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { PrestataireDetailComponent } from './prestataire-detail/prestataire-detail.component';
import { PrestatairesRoutingModule } from './prestataires.routing';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from '../../material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormulairePrestataireComponent } from './prestataires/formulaire-prestataire/formulaire-prestataire.component';
import { EditPrestataireComponent } from './prestataires/edit-prestataire/edit-prestataire.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    PrestatairesRoutingModule,
    NgxPaginationModule,
    MatPaginatorModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [AppPrestatairesComponent, PrestataireDetailComponent, FormulairePrestataireComponent, EditPrestataireComponent],
})
export class PrestatairesModule { }
