import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCartesVisitesComponent } from './cartes-visites.component';
import { RouterModule } from '@angular/router';
import { CartesVisitesRoutingModule } from './cartes-visites.routing';
import { FormulaireCartesVisitesComponent } from './formulaire-cartes-visites/formulaire-cartes-visites.component'
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppCartesVisitesComponent,
    FormulaireCartesVisitesComponent

  ],
  imports: [
    CommonModule,
    CartesVisitesRoutingModule,
    RouterModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class CartesVisitesModule { }
