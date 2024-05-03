
import { Component, OnInit } from '@angular/core';
import { ClientService } from './clients.service';
import { Clients } from './clients.model';
import { catchError, EMPTY, Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

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

  constructor(private clientService: ClientService) { }

  clientTypes: string[] = [
    'Actif',
    'Inactif',
    'Expiré',
  ];

  ngOnInit(): void {
    this.getClientList();
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
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    if (this.searchQuery) {
      this.currentPage = 1; // Réinitialise currentPage pour la recherche
      this.searchClients();
    } else {
      this.getClientList();
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
      } else {
        // Gérer le cas où la réponse est invalide ou vide
        console.error('Invalid response:', response);
      }
      this.isLoading = false;
    });
  }



  deleteClient(id: number): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(id).subscribe(() => {
        if (this.searchQuery) {
          this.searchClients();
        } else {
          this.getClientList();
        }
      });
    }
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
}
