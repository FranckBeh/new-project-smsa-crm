import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRequestsComponent } from './requests.component';
import { FormulaireRequestsComponent } from './add-requests/formulaire-requests/formulaire-requests.component';

//import { AuthGuard } from 'src/app/auth.guard'; // Adjust the path as needed

const routes: Routes = [
  {
    path: '',
   component: AppRequestsComponent
  },
  {

  path: 'add-requests/formulaire-requests/:id',
   component: FormulaireRequestsComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestsRoutingModule { }
