
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocieteService } from './societe.service';
import { Societe } from './societe.model';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';
import { FormulaireSocieteComponent } from './formulaire-societe/formulaire-societe.component';

@Component({
  selector: 'app-societe',
  templateUrl: './societe.component.html',
  styleUrls: ['./societe.component.scss']
})
export class AppSocieteComponent implements OnInit  {
  societes$: Observable<Societe[]>; // Utilisez le type Observable<Client[]>
  currentPage: number = 1;
  itemsPerPage = 10;
  currentDate: Date = new Date();
  totalSocietes: number;
  searchQuery: string = '';
  currentTab: string = 'actif'; // Ajoutez cette ligne
  errorMessage: any;
  isLoading: boolean;

  constructor(private SocieteService: SocieteService, public dialog:MatDialog) { }


  societeTypes: string[] = [
    'Actif',
    'Inactif',
    'Expiré',
  ];

  ngOnInit(): void {
    this.getSocieteList(); // Appelez getClientList() au lieu de getClients()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormulaireSocieteComponent, {
      width: '250px',
      // Vous pouvez passer des données au formulaire modal ici
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Le formulaire modal a été fermé');
      // Vous pouvez traiter le résultat ici
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.getSocieteList();
  }


  getSocieteList(): void {
    this.isLoading = true;
    this.SocieteService.getSociete(this.currentPage, this.itemsPerPage).pipe(
      catchError(error => {
        console.error('Error retrieving societes:', error);
        this.errorMessage = error.message;
        this.isLoading = false;
        return EMPTY;
      })
    ).subscribe((response: { totalSocietes: number; societes: any; }) => {
      this.totalSocietes = response.totalSocietes;
      this.societes$ = of(response.societes); // Utilisez l'opérateur 'of' pour convertir les données réelles en Observable
      this.isLoading = false;
    });
  }



  search(): void {
    this.currentPage = 1;
    this.getSocieteList(); // Appelez getClientList() au lieu de getClients()
  }

  deleteSociete(id: number): void {
    if (confirm('Are you sure you want to delete this societe?')) {
      this.SocieteService.deleteSociete(id).subscribe(() => {
        this.getSocieteList();
      });
    }
  }

  exportClients(): void {
    console.log('Exporting societes...');
  }

  viewSociete(societe: Societe): void {
    console.log('Viewing societe:', societe);
  }

  editSociete(societe: Societe): void {
    console.log('Editing societe:', societe);
  }

  changeTab(tabName: string): void {
    console.log('Changing tab to:', tabName);
  }
}
function getSocieteCount(): number {
  throw new Error('Function not implemented.');
}

