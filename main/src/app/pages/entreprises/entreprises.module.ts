import { NgModule } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { EntrepriseComponent } from './entreprises.component';
import { RouterModule } from '@angular/router';
import {EntreprisesRoutingModule} from './entreprises.routing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntrepriseModalComponent } from './entreprises-modal/entreprise-modal.component';
import {EntrepriseCreateModalComponent} from './entreprises-modal/entreprise-create-modal.component';

@NgModule({
  declarations: [
    EntrepriseComponent,
    EntrepriseModalComponent,
    EntrepriseCreateModalComponent
  ],
  imports: [
    CommonModule,
    EntreprisesRoutingModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,

  ],
  exports: [
    
  ]
})
export class EntreprisesModule { }
