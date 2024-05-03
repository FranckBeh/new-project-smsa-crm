import { AppInvoiceComponent } from './invoice/invoice.component';
import { Routes } from '@angular/router';
import { AppDashboardComponent } from './dashboard/dashboard.component';


export const PagesRoutes: Routes = [
  {
    path: '',
    component: AppDashboardComponent,
    data: {
      title: 'CRM SMSA',
    },
  },

  {
    path: './invoice',
    component: AppInvoiceComponent,
    data: {
      title: 'Gestion Factures',
    },
  },
];
