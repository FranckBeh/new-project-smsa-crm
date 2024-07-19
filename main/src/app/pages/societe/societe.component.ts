
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


  getSocieteList(search?: string): void {
    this.isLoading = true;
    this.SocieteService.getSociete(this.currentPage, this.itemsPerPage, search).pipe(
      catchError(error => {
        console.error('Error retrieving societes:', error);
        this.isLoading = false;
        return EMPTY;
      })
    ).subscribe((response: { totalSocietes: number; societes: any; }) => {
      this.totalSocietes = response.totalSocietes;
      this.societes$ = of(response.societes);
      this.isLoading = false;
    });
  }
  searchSocietes(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    // Appelez getSocieteList avec le terme de recherche
 //   this.currentPage = 1;
    this.getSocieteList(searchTerm);
  }


  search(): void {
    this.currentPage = 1;
    this.getSocieteList(); // Appelez getClientList() au lieu de getClients()
  }

  deleteSociete(idSociete: number): void {
    if (confirm('Are you sure you want to delete this societe?')) {
      this.SocieteService.deleteSociete(idSociete).subscribe(() => {
        this.getSocieteList();
      });
    }
  }

  exportClients(): void {

  }

  viewSociete(societe: Societe): void {

  }

  editSociete(societe: Societe): void {
    // Implémentez la logique pour éditer la société (par exemple, ouvrez un dialogue modal avec le formulaire de modification)
    const dialogRef = this.dialog.open(FormulaireSocieteComponent, {
      width: '250px',
      data: societe // Passez les données de la société à modifier
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Le formulaire modal a été fermé après modification');
      // Vous pouvez traiter le résultat ici (par exemple, mettre à jour la liste des sociétés)
      this.getSocieteList();
    });
  }

}

