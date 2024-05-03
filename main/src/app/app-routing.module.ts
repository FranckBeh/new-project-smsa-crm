import { SocieteModule } from './pages/societe/societe.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
      },
      {
        path: 'clients',
        loadChildren: () =>
        import('./pages/clients/clients.module').then((m) => m.ClientModule),
      },
      {
        path: 'freelancers',
        loadChildren: () =>
          import('./pages/freelancers/freelancers.module').then((m) => m.FreelancersModule),
      },
      {
        path: 'invoice',
        loadChildren: () =>
          import('./pages/invoice/invoice.module').then((m) => m.InvoiceModule),
      },
      {
        path: 'requests',
        loadChildren: () =>
          import('./pages/requests/requests.module').then((m) => m.RequestsModule),
      },
      {
        path: 'prestataires',
        loadChildren: () =>
          import('./pages/prestataires/prestataires.module').then((m) => m.PrestatairesModule),
      },
      {
        path: 'reclamations',
        loadChildren: () =>
          import('./pages/reclamations/reclamations.module').then((m) => m.ReclamationsModule),
      },
      {
        path: 'cartes-visites',
        loadChildren: () =>
          import('./pages/cartes-visites/cartes-visites.module').then((m) => m.CartesVisitesModule),
      },
      {
        path: 'societe',
        loadChildren: () =>
          import('./pages/societe/societe.module').then((m) => m.SocieteModule),
      },
      {
        path: 'entreprises',
        loadChildren: () =>
          import('./pages/entreprises/entreprises.module').then((m) => m.EntreprisesModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./pages/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'domaines',
        loadChildren: () =>
          import('./pages/domaines/domaines.module').then((m) => m.DomainesModule),
      },
      {
        path: 'villes',
        loadChildren: () =>
          import('./pages/villes/villes.module').then((m) => m.VillesModule),
      },
      {
        path: '**', // Route par défaut pour les chemins non correspondants
        redirectTo: '/dashboard',
      },
    ],
  },
  {
    path: 'authentication',
    component: BlankComponent,
    loadChildren: () =>
      import('./pages/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
