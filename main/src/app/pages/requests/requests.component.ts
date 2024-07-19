import { Component, OnInit, ViewChild } from '@angular/core';
import { NoteService } from './requests.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class AppRequestsComponent implements OnInit {
  currentRequests: any[] = [];
  finalizedRequests: any[] = [];
  searchQuery: string = '';
  pageSize: number = 10;
  totalItemsCurrent: number = 0;
  totalItemsFinalized: number = 0;
  activeTab: 'current' | 'finalized' = 'current'; // Onglet actif par défaut

  loadingCurrent: boolean = false; // Variable pour le chargement des requêtes en cours
  loadingFinalized: boolean = false; // Variable pour le chargement des requêtes finalisées

  @ViewChild('currentPaginator') currentPaginator!: MatPaginator;
  @ViewChild('finalizedPaginator') finalizedPaginator!: MatPaginator;

  constructor(private noteService: NoteService, private snackBar: MatSnackBar, public router: Router ) {}

  ngOnInit(): void {
    this.fetchCurrentRequests();
    this.fetchFinalizedRequests();
  }

  changeTab(tab: 'current' | 'finalized') {
    this.activeTab = tab; // Changement de l'onglet actif
  }

  fetchCurrentRequests() {
    this.loadingCurrent = true; // Activer le chargement en cours
    const pageIndex = this.currentPaginator ? this.currentPaginator.pageIndex : 0;
    this.noteService.getCurrentNotes(pageIndex, this.pageSize, this.searchQuery)
      .subscribe(response => {
        this.currentRequests = response.rows;
        this.totalItemsCurrent = response.count;
        if (this.currentPaginator) {
          this.currentPaginator.length = this.totalItemsCurrent;
        }
        this.loadingCurrent = false; // Désactiver le chargement une fois les données chargées
      }, error => {
        console.error('Error fetching current requests:', error);
        this.showError('Une erreur est survenue lors du chargement des requêtes actuelles.');
        this.loadingCurrent = false; // Désactiver le chargement en cas d'erreur
      });
  }

  fetchFinalizedRequests() {
    this.loadingFinalized = true; // Activer le chargement en cours
    const pageIndex = this.finalizedPaginator ? this.finalizedPaginator.pageIndex : 0;
    this.noteService.getFinalizedNotes(pageIndex, this.pageSize, this.searchQuery)
      .subscribe(response => {
        this.finalizedRequests = response.rows;
        this.totalItemsFinalized = response.count;
        if (this.finalizedPaginator) {
          this.finalizedPaginator.length = this.totalItemsFinalized;
        }
        this.loadingFinalized = false; // Désactiver le chargement une fois les données chargées
      }, error => {
        console.error('Error fetching finalized requests:', error);
        this.showError('Une erreur est survenue lors du chargement des requêtes finalisées.');
        this.loadingFinalized = false; // Désactiver le chargement en cas d'erreur
      });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000, // Durée en ms
      panelClass: ['error-snackbar'] // Classe CSS pour personnaliser le style
    });
  }

  search() {
    this.fetchCurrentRequests();
    this.fetchFinalizedRequests();
  }

  export() {
    // Implémentation de l'exportation
  }

  create() {
    // Implémentation de la création
  }

  pageChanged(event: any, type: string) {
    if (type === 'current') {
      this.fetchCurrentRequests();
    } else {
      this.fetchFinalizedRequests();
    }
  }
}

