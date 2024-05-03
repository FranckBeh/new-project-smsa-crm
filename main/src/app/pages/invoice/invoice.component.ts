import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { InvoiceService } from './invoice.service';
import { EntrepriseService } from './../entreprises/entreprises.service';
import { Invoice } from './invoice.model'; // Assurez-vous d'importer correctement votre modèle d'objet Invoice

import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Entreprise, SelectedEntreprise } from '../entreprises/entreprises.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppInvoiceComponent implements OnInit, OnDestroy {
  entreprises: any[] = [];
  selectedEntreprise: SelectedEntreprise | null = null;
  invoices: Invoice[] = [];
  selectedInvoice: Invoice | null = null;
  isNewInvoice = false;
  isEditingInvoice = false;
  isDeletingInvoice = false;
  private invoiceSubscription: Subscription;
  selectedInvoices: { [key: number]: boolean } = {};
  allInvoices: Invoice[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  searchQuery: string = ''; // Initialisez searchQuery selon vos besoins

  // Différents types de factures
  invoiceTypes: string[] = [
    'Factures Payées',
    'Factures Payées En attente',
    'Factures créances',
    'BL Payés',
    'BL Payés En attente',
    'BL créances',
    'Avoirs',
    'Devis',
    'Bilans',
  ];

  // Entêtes de la liste des factures
  displayedColumns: string[] = [
    'Réf.',
    'Société',
    'NC',
    'Date',
    'Nbr articles',
    'TVA',
    'Total TTC',
    'Date Pay.',
    'Mode Pay.',
  ];
getRowClass: any;


  getHeaderClass(column: string): string {
    // Définissez les classes CSS pour chaque colonne en fonction de son nom
    switch(column) {
      case 'Réf.':
        return 'sorting';
      case 'Société':
        return 'sorting';
      case 'NC':
        return 'sorting';
      case 'Date':
        return 'sorting';
      case 'Nbr articles':
        return 'sorting';
      case 'TVA':
        return 'sorting';
      case 'Total TTC':
        return 'sorting';
      case 'Date Pay.':
        return 'sorting';
      case 'Mode Pay.':
        return 'sorting_disabled';
      case 'Actions':
        return 'cell-fit sorting_disabled';
      default:
        return '';
    }
  }

  getColumnWidth(column: string): string {
    // Définissez les largeurs de colonnes en fonction de leur nom
    switch(column) {
      case 'Réf.':
        return '85px';
      case 'Société':
        return 'px';
      case 'NC':
        return '60px';
      case 'Date':
        return '156px';
      case 'Nbr articles':
        return 'auto';
      case 'TVA':
        return 'auto';
      case 'Total TTC':
        return '88px';
      case 'Date Pay.':
        return 'auto';
      case 'Mode Pay.':
        return '117px';
      case 'Actions':
        return '76px';
      default:
        return 'auto';
    }
  }

  getHeaderLabel(column: string): string {
    // Définissez les libellés de colonnes en fonction de leur nom
    switch(column) {
      case 'Réf.':
        return '#ID';
      case 'Société':
        return 'Client';
      case 'NC':
        return '';
      case 'Date':
        return 'Issued Date';
      case 'Nbr articles':
        return '';
      case 'TVA':
        return '';
      case 'Total TTC':
        return 'Total';
      case 'Date Pay.':
        return '';
      case 'Mode Pay.':
        return 'Balance';
      case 'Actions':
        return 'Actions';
      default:
        return '';
    }
  }

  getHeaderSort(column: string): string {
    // Définissez le type de tri pour chaque colonne en fonction de son nom
    switch(column) {
      case 'Réf.':
        return 'descending';
      case 'Société':
        return 'ascending';
      case 'NC':
        return 'ascending';
      case 'Date':
        return 'ascending';
      case 'Nbr articles':
        return '';
      case 'TVA':
        return '';
      case 'Total TTC':
        return 'ascending';
      case 'Date Pay.':
        return '';
      case 'Mode Pay.':
        return '';
      case 'Actions':
        return '';
      default:
        return '';
    }
  }



  constructor(
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private entrepriseService: EntrepriseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invoiceSubscription = this.invoiceService.errorOccurred.subscribe(errorMessage => {
      if (errorMessage) {
        // Gérez l'erreur ici, par exemple en affichant un message
      }
    });
    this.loadAllInvoices();
    this.loadEntreprises();
  }


  ngOnDestroy(): void {
    this.invoiceSubscription.unsubscribe();
  }

  loadEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe((entreprises) => {
      this.entreprises = entreprises;
    }, error => {
      console.error('Erreur lors du chargement des entreprises :', error);
    });
  }

  selectEntreprise(entreprise: any): void {
    this.selectedEntreprise = entreprise;
  }
  getEnterprises() {
    // Appel à un service pour récupérer la liste des entreprises depuis votre backend
    // Exemple fictif :
    this.entrepriseService.getEntreprises().subscribe((enterprises: Entreprise[]) => {
      this.entreprises = enterprises;
    }, error => {
      console.error('Erreur lors du chargement des entreprises :', error);
    });
  }


  onEnterpriseSelected() {
    // Vérifier si une entreprise a été sélectionnée
    if (this.selectedEntreprise) {
      console.log('Entreprise sélectionnée :', this.selectedEntreprise);
      // Rediriger vers la page de création de facture en passant l'ID de l'entreprise comme paramètre
      this.createInvoice();
     // this.router.navigate(['invoice/formulaire-facture'], { queryParams: { entrepriseId: this.selectedEntreprise.idCompanie } });
    } else {
      console.error('Aucune entreprise sélectionnée.');
    }
  }



 // loadInvoices(): void {
  //   this.invoiceService.getInvoiceData(this.currentPage, this.pageSize).subscribe(
 //      response => {
  //       this.invoices = response.invoices;
  //       this.totalItems = this.invoiceService.getInvoiceCount;      },
  //     error => {
    //     console.error('Failed to load invoices', error);
   //    }
  //   );
  // }

  // onPageChange(page: number): void {
  //   this.currentPage = page;
  //   this.loadInvoices();
  // }

  ceil(value: number): number {
    return Math.ceil(value);
  }

  getDisplayedPages(): number[] {
    const totalPages = this.ceil(this.totalItems / this.pageSize);
    const pages = [];
    for (let i = 0; i < totalPages && i < 5; i++) {
      pages.push(i + 1);
    }
    return pages;
  }

  getMiddlePages(): number[] {
    const totalPages = this.ceil(this.totalItems / this.pageSize);
    const pages = [];

    // Déterminer les numéros de page à afficher autour de la page actuelle
    let start = Math.max(this.currentPage - 2, 2);
    let end = Math.min(start + 4, totalPages - 1);

    // Ajuster si nous sommes proches de la première ou de la dernière page
    if (this.currentPage < 4) {
      end = 5;
    }
    if (this.currentPage > totalPages - 4) {
      start = totalPages - 5;
    }

    // Générer les numéros de page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getPagesInRange(start: number, end: number): number[] {
    const pages = [];
    for (let i = start; i <= end; i++) {
      // Assurez-vous que 'i' est un nombre entier
      if (Number.isInteger(i)) {
        pages.push(i);
      }
    }
    return pages;
  }

  shouldShowFirstPages(): boolean {
    return this.currentPage > 5;
  }

  shouldShowFirstEllipsis(): boolean {
    return this.currentPage > 8;
  }

  shouldShowLastEllipsis(): boolean {
    const totalPages = this.ceil(this.totalItems / this.pageSize);
    return this.currentPage < totalPages - 7;
  }

  shouldShowLastPages(): boolean {
    const totalPages = this.ceil(this.totalItems / this.pageSize);
    return this.currentPage < totalPages - 4;
  }

  isLastPage(): boolean {
    return this.currentPage === this.ceil(this.totalItems / this.pageSize);
  }


  loadAllInvoices(): void {
    this.invoiceService.getInvoiceData().subscribe(
      (invoices: Invoice[]) => {
        this.allInvoices = invoices;
        this.totalItems = invoices.length;
        this.updatePage();
      },
      error => {
        console.error('Failed to load invoices', error);
      }
    );
  }

  updatePage(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.invoices = this.allInvoices.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePage();
  }


  createInvoice(): void {
    if (this.selectedEntreprise) {
      this.selectedInvoice = null;
      this.isNewInvoice = true;
    //  console.log('Selected entreprise ID:', this.selectedEntreprise.idCompanie);
      // Créer la facture pour l'entreprise sélectionnée
      // Vous pouvez envoyer une requête HTTP à votre backend pour créer la facture
      // Assurez-vous d'utiliser l'ID ou d'autres informations de l'entreprise sélectionnée dans la requête
   this.router.navigate(['invoice/formulaire-facture'], { state: { entrepriseId: this.selectedEntreprise?.idCompanie } });
    } else {
      console.error('Aucune entreprise sélectionnée.');
    }
  }







  updateInvoice(invoice: Invoice): void {
    this.selectedInvoice = invoice;
    this.isEditingInvoice = true;
  }

  deleteInvoice(invoice: Invoice): void {
    this.selectedInvoice = invoice;
    this.isDeletingInvoice = true;
  }

  confirmDeleteInvoice(): void {
    if (this.selectedInvoice) {
      this.invoiceService.deleteInvoice(this.selectedInvoice.id).subscribe(
        () => {
          this.loadAllInvoices();
          this.cancelDeleteInvoice();
          this.showSuccess('Invoice deleted successfully!');
        },
        (error) => {
          this.showError('Failed to delete invoice');
        }
      );
    }
  }

  cancelDeleteInvoice(): void {
    this.selectedInvoice = null;
    this.isDeletingInvoice = false;
  }

  saveInvoice(invoice: Invoice): void {
    const saveAction = this.isNewInvoice ? 'create' : 'update';
    const saveObservable = this.isNewInvoice
      ? this.invoiceService.createInvoice(invoice)
      : this.invoiceService.updateInvoice(invoice.id, invoice);

    saveObservable.subscribe(
      () => {
        this.loadAllInvoices();
        this.cancelEditInvoice();
        this.showSuccess(`Invoice ${saveAction}d successfully!`);
      },
      (error) => {
        this.showError(`Failed to ${saveAction} invoice`);
      }
    );
  }

  cancelEditInvoice(): void {
    this.selectedInvoice = null;
    this.isNewInvoice = false;
    this.isEditingInvoice = false;
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-error'],
    });
  }

  search(): void {
    // Implémentez la logique de recherche ici
  }
  getInvoiceValue(invoice: Invoice, column: string): any {
    switch (column) {
      case 'Réf.':
        return invoice.id;
      case 'Société':
        return invoice.customerName;
      case 'NC':
        // Par exemple, si 'NC' représente le nombre d'articles, vous pouvez implémenter cette logique ici
        return invoice.items.length;
      case 'Date':
        // Vous pouvez utiliser la méthode toLocaleDateString() pour formater la date selon vos besoins
        return invoice.date.toLocaleDateString();
      case 'Nbr articles':
        // Si vous voulez afficher le nombre total d'articles, vous pouvez parcourir tous les articles et calculer la somme des quantités
        let totalQuantity = 0;
        invoice.items.forEach(item => {
          totalQuantity += item.quantity;
        });
        return totalQuantity;
      case 'TVA':
        // Ajoutez votre logique pour la TVA ici
        return 'TVA';
      case 'Total TTC':
        return invoice.total;
      case 'Date Pay.':
        // Ajoutez votre logique pour la date de paiement ici
        return 'Date Pay.';
      case 'Mode Pay.':
        // Ajoutez votre logique pour le mode de paiement ici
        return 'Mode Pay.';
      default:
        return '';
    }
  }

  getInvoicesByType(type: string): Invoice[] {
    // Logique pour filtrer les factures en fonction du type spécifié
    return this.invoices.filter(invoice => invoice.type === type);
  }

  // Fonction pour trier les factures par colonne


  toggleSelectInvoice(invoice: Invoice): void {
    this.selectedInvoices[invoice.id] = !this.selectedInvoices[invoice.id];
  }

  selectAllInvoices(type: string): void {
    this.getInvoicesByType(type).forEach(invoice => {
      this.selectedInvoices[invoice.id] = true;
    });
  }

  deselectAllInvoices(type: string): void {
    this.getInvoicesByType(type).forEach(invoice => {
      this.selectedInvoices[invoice.id] = false;
    });
  }

  exportSelectedToExcel(): void {
    const selectedIds = Object.entries(this.selectedInvoices)
      .filter(([id, selected]) => selected)
      .map(([id, selected]) => id.toString());

    const selectedInvoices = this.invoices.filter(invoice => selectedIds.includes(invoice.id.toString()));
    // Logique pour exporter les factures sélectionnées vers Excel
  }

  exportSelectedToPDF(): void {
    const selectedIds = Object.entries(this.selectedInvoices)
      .filter(([id, selected]) => selected)
      .map(([id, selected]) => id.toString());

    const selectedInvoices = this.invoices.filter(invoice => selectedIds.includes(invoice.id.toString()));
    // Logique pour exporter les factures sélectionnées vers PDF
  }


  // Fonction pour exporter les factures en format Excel
  exportToExcel(): void {
    // Implémentez la logique d'exportation en format Excel ici
  }

  // Fonction pour exporter les factures en format PDF
  exportToPDF(): void {
    // Implémentez la logique d'exportation en format PDF ici
  }
}
