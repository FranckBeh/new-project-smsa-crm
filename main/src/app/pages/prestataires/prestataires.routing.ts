import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppPrestatairesComponent } from './prestataires.component';
import { PrestataireDetailComponent } from './prestataire-detail/prestataire-detail.component'; // Assuming you have a detail component
import { FormulairePrestataireComponent } from './prestataires/formulaire-prestataire/formulaire-prestataire.component';
import { EditPrestataireComponent } from './prestataires/edit-prestataire/edit-prestataire.component';
//import { AuthGuard } from 'src/app/auth.guard'; // Adjust the path as needed

const routes: Routes = [
  {
    path: '',
    component: AppPrestatairesComponent
  },
  {
    path: 'prestataire-detail/:id',
    component: PrestataireDetailComponent
  },
  {
  //  canActivate: [AuthGuard],
    path: 'prestataires/edit-prestataire/:id',
    component: EditPrestataireComponent, // Assuming the same component is used for editing
  },
  {
    path: 'prestataires/formulaire-prestataire',
    component:  FormulairePrestataireComponent  // Assuming the same component is used for creating
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestatairesRoutingModule { }
