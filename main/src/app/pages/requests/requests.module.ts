import { RequestsRoutingModule } from './requests.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRequestsComponent } from './requests.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MaterialModule } from '../../material.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { RequestsDetailComponent } from './detail/requests-detail/requests-detail.component';
import { FormulaireRequestsComponent } from './add-requests/formulaire-requests/formulaire-requests.component';
import { EditRequestsComponent } from './update-requests/edit-requests/edit-requests.component';



@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
   RequestsRoutingModule,
    NgxPaginationModule,
    MatPaginatorModule,
    MaterialModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [
    AppRequestsComponent,
    RequestsDetailComponent,
    FormulaireRequestsComponent,
    EditRequestsComponent,

  ],
})
export class RequestsModule { }
