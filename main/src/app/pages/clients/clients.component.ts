import { Component, OnInit } from '@angular/core';
import { ClientService } from './clients.service';
import { Clients, TypeClient } from './clients.model';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, map, Observable, of, startWith } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormulaireClientComponent } from './formulaire-client/formulaire-client.component';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NULL } from 'sass';

const AVAILABLE_FIELDS = [
  'Nom',
  'Prénom',
  'TypeClient',
  'Téléphone pro',
  'Téléphone perso',
  'Fixe',
  'Email pro',
  'Email perso',
  'Société',
  'Login',
  'Expiration',
  'Fonction'
];

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class AppClientsComponent implements OnInit {

  clients$: Observable<Clients[]>;
  searchResults: Clients[] = [];
  currentPage: number = 1;
  itemsPerPage = 10;
  currentDate: Date = new Date();
  totalClients: number;
  searchQuery: string = '';
  currentTab: string = 'actif';
  errorMessage: any;
  isLoading: boolean;
  searchPerformed: boolean = false;
  selectedType: number;
  typeClients: TypeClient[] = [];
  filteredTypes: Observable<any[]>;
  searchControl = new FormControl();
  // Champs disponibles pour l'exportation
  availableFields: string[] = AVAILABLE_FIELDS;
  TypeId: number;
  // Champs sélectionnés pour l'exportation
  selectedFields: string[] = [...AVAILABLE_FIELDS]; // Par défaut, tous les champs sont sélectionnés
  isLoadingType: boolean;
  allClients: Clients[] = [];

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  clientTypes: string[] = [
    'Actif',
    'Inactif',
    'Expiré',
  ];

  ngOnInit(): void {
    this.getClientList();
    this.loadTypes();
    this.initializeFilters();
    this.loadAllClients();
  }



  search(): void {
    this.searchPerformed = true;
    this.currentPage = 1;
    if (this.searchQuery) {
      this.searchClients();
    } else {
      this.getClientList();
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; // Page index starts at 0, so increment by 1 for human-readable page numbers
    this.itemsPerPage = event.pageSize;
    if (this.searchQuery) {
      this.searchClients();
    } else {
      this.getClientList();
    }
  }

  private initializeFilters(): void {
    this.filteredTypes = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => this.filterTypes(value))
    );

  }
  private filterTypes(value: any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.NomType.toLowerCase();
    return this.typeClients.filter(type => type.NomType.toLowerCase().includes(filterValue));
  }

  loadTypes(): void {
    this.isLoadingType = true; // Activation de l'indicateur de chargement
    this.clientService.loadTypeClient().subscribe(
      (types) => {
        this.typeClients = types;
        this.isLoadingType = false; // Désactivation de l'indicateur de chargement
      },
      (error) => {
        console.error('Erreur lors du chargement des sociétés :', error);
        this.isLoadingType = false; // Désactivation de l'indicateur de chargement en cas d'erreur
      }
    );
  }

  displayType(type: any): string {
    return type?.NomType ?? '';
  }

  onTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedType = event.option.value;
    if (selectedType) {
        this.TypeId = selectedType.NumType;
        console.log('TypeId défini dans onTypeSelected:', this.TypeId);
    }
}


  getClientList(): void {
    this.searchPerformed = false;
    this.isLoading = true;
    this.clientService.getClients(this.currentPage, this.itemsPerPage).pipe(
      catchError(error => {
        console.error('Error retrieving clients:', error);
        this.errorMessage = error.message;
        this.isLoading = false;
        return EMPTY;
      })
    ).subscribe(response => {
      if (response && response.totalClients && response.clients) {
        this.totalClients = response.totalClients;
        this.clients$ = of(response.clients);
        this.searchResults = response.clients; // Populate searchResults for export purposes
      } else {
        // Gérer le cas où la réponse est invalide ou vide
        console.error('Invalid response:', response);
      }
      this.isLoading = false;
    });
  }

  deleteClient(clientId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet client?')) {
      this.clientService.deleteClient(clientId).subscribe(
        response => {
          this.dialog.open(DialogComponent, {
            data: {
              title: 'Suppression réussie',
              message: 'Le client a été supprimé avec succès.'
            }
          });
          this.getClientList(); // Refresh the list after deletion
        },
        error => {
          console.error('Erreur lors de la suppression du client :', error);
          this.errorMessage = 'Erreur lors de la suppression du client.';
        }
      );
    }
  }

  onDeleteClient(clientId: number): void {
    const confirmationDialog = this.dialog.open(DialogComponent, {
      data: {
        title: 'Confirmation de suppression',
        message: 'Êtes-vous sûr de vouloir supprimer ce client?',
      }
    });

    confirmationDialog.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteClient(clientId).subscribe(
          response => {
            this.dialog.open(DialogComponent, {
              data: {
                title: 'Suppression réussie',
                message: 'Le client a été supprimé avec succès.'
              }
            });
            this.getClientList(); // Refresh the list after deletion
          },
          error => {
            console.error('Erreur lors de la suppression du client :', error);
            this.errorMessage = 'Erreur lors de la suppression du client.';
          }
        );
      }
    });
  }

  exportClients(): void {
    console.log('Exporting clients...');
  }

  viewClient(client: Clients): void {
    console.log('Viewing client:', client);
  }

  editClient(client: Clients): void {
    console.log('Editing client:', client);
  }

  changeTab(tabName: string): void {
    console.log('Changing tab to:', tabName);
  }

  searchClients(): void {
    this.clientService.searchClients(this.searchQuery, this.currentPage, this.itemsPerPage)
      .subscribe(response => {
        this.totalClients = response.totalClients;
        this.searchResults = response.clients;
      }, error => {
        console.error('Error searching clients:', error);
      });
  }
  loadAllClients(): void {
    this.clientService.getAllClients().subscribe(
      (data) => {
        this.allClients = data;
        console.log('Toutes les données des clients chargées:', this.allClients);
      },
      (error) => {
        console.error('Erreur lors du chargement des données des clients:', error);
      }
    );
  }


  toggleFieldSelection(field: string): void {
    if (this.selectedFields.includes(field)) {
        // Retirer le champ si déjà sélectionné
        this.selectedFields = this.selectedFields.filter(f => f !== field);
    } else {
        // Ajouter le champ si non sélectionné
        this.selectedFields.push(field);
    }
    console.log('Champs sélectionnés mis à jour:', this.selectedFields);
}

exportClientsByType(typeId: number): void {
  typeId = this.TypeId;
  console.log('TypeId sélectionné:', typeId);

  if (!this.allClients || this.allClients.length === 0) {
    console.error('Aucune donnée disponible dans allClients.');
    return;
  }
  console.log('allClients:', this.allClients);

  const filteredClients = this.allClients.filter(client => {
    console.log('Client:', client);
    return client.typeclient_id === typeId;
  });

  if (!filteredClients || filteredClients.length === 0) {
    console.error('Aucun client trouvé pour le type spécifié.');
    return;
  }

  console.log('Clients filtrés:', filteredClients);

  const exportData = filteredClients.map(client => {
    const clientData: { [key: string]: any } = {};
    this.selectedFields.forEach(field => {
      switch (field) {
        case 'Nom':
          clientData['Nom'] = client.nom;
          break;
        case 'Prénom':
          clientData['Prénom'] = client.prenom;
          break;
        case 'TypeClient':
          clientData['TypeClient'] = client.typeclient?.NomType || '-';
          break;
        case 'Téléphone pro':
          clientData['Téléphone pro'] = client.gsmPro;
          break;
          case 'Téléphone Perso':
          clientData['Téléphone'] = client.gsmPerso;
          break;
          case 'Fixe':
          clientData['Fixe'] = client.fixePro || client.fixePro ;
          break;
        case 'Email Pro':
          clientData['Email Pro'] = client.mailPro;
          break;
          case 'Email Perso':
          clientData['Email'] = client.mailPerso;
          break;
        case 'Société':
          clientData['Société'] = client.societe?.nom || '-';
          break;
        case 'Login':
          clientData['Login'] = client.login;
          break;
        case 'Expiration':
          clientData['Expiration'] = client.expiration ? new Date(client.expiration).toLocaleDateString() : '-';
          break;
        case 'Fonction':
          clientData['Fonction'] = client.fonction || '-';
          break;
        default:
          clientData[field] = client[field as keyof typeof client] || '-';
      }
    });
    return clientData;
  });

  console.log('Données à exporter:', exportData);

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'Clients': worksheet },
    SheetNames: ['Clients']
  };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  saveAs(blob, `clients_${typeId}.xlsx`);
}




}
