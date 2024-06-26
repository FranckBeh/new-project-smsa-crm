import { Component, OnInit, OnDestroy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { InvoiceService } from './invoice.service';
import { EntrepriseService } from './../entreprises/entreprises.service';
import { Invoice } from './invoice.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Entreprise } from '../entreprises/entreprises.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppInvoiceComponent implements OnInit, OnDestroy {
  @Output() EnterpriseSelected: EventEmitter<Entreprise> = new EventEmitter<Entreprise>();

  entreprises: any[] = [];
  selectedEntreprise: Entreprise ;
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
  selectedEntrepriseName: string = '';
  selectedEntrepriseId: number | null = null;
  selectedEntrepriseNom: string = '';
  searchParams: any = {
    dateType: 'fixed', // Default value
    company: '',
    type: '',
    etat: '',
    reference: '',
    startDate: '',
    endDate: '',
    fixedDate: '',
    societeName: '' // Nouveau champ pour la recherche par nom de société
  };
  isLoading = false; // Variable pour indiquer le chargement

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

  constructor(
    private invoiceService: InvoiceService,
    private snackBar: MatSnackBar,
    private entrepriseService: EntrepriseService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.invoiceSubscription = this.invoiceService.errorOccurred.subscribe(errorMessage => {
      if (errorMessage) {
        // Gérez l'erreur ici, par exemple en affichant un message
      }
    });
   // this.loadAllInvoices();
   // this.loadEntreprises();
   // this.searchInvoices({});
   this.loadData();
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

  selectEntreprise(entreprise: Entreprise): void {
    this.selectedEntreprise = entreprise;

  }

  onEnterpriseSelected() {
    if (this.selectedEntreprise) {
      console.log('Entreprise sélectionnée :', this.selectedEntreprise);

      this.entrepriseService.changerEntreprise(this.selectedEntreprise);
    this.router.navigate(['invoice/formulaire-facture'], { state: { entrepriseId: this.selectedEntreprise } });

    } else {
      console.error('Aucune entreprise sélectionnée.');
    }
  }



  searchInvoices(params: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.invoiceService.searchInvoices(params).subscribe(
        (data: any) => {
          this.invoices = data;
          this.allInvoices = this.invoices;
          this.totalItems = this.invoices.length;
          this.updatePage();
          resolve();
        },
        error => {
          console.error('Failed to load invoices', error);
          this.isLoading = false;
          reject(error);
        }
      );
    });
  }

  loadData() {
    this.isLoading = true;
    Promise.all([this.loadEntreprises(), this.searchInvoices({})])
      .then(() => {
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Failed to load data', error);
        this.isLoading = false;
      });
  }

  onSearch(params: any): void {
    this.isLoading = true;
    this.searchInvoices(params).finally(() => {
      this.isLoading = false;
    });
  }

  onDateTypeChange() {
    if (this.searchParams.dateType === 'fixed') {
      this.searchParams.startDate = '';
      this.searchParams.endDate = '';
    } else if (this.searchParams.dateType === 'range') {
      this.searchParams.fixedDate = '';
    }
  }

  getRowClass: any;

  getHeaderClass(column: string): string {
    switch(column) {
      case 'Réf.':
      case 'Société':
      case 'NC':
      case 'Date':
      case 'Nbr articles':
      case 'TVA':
      case 'Total TTC':
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
  getPaymentModeText(paymentMode: number): string {
    switch (paymentMode) {
      case 0:
        return 'Espèces';
      case 1:
        return 'Chèque';
      case 2:
        return 'Effet';
      case 3:
        return 'Carte bancaire';
      case 4:
        return 'Virement';
      default:
        return 'Impayé';
    }
  }


  getColumnWidth(column: string): string {
    switch(column) {
      case 'Réf.':
        return '85px';
      case 'Date':
        return '156px';
      case 'Total TTC':
        return '88px';
      case 'Mode Pay.':
        return '117px';
      case 'Actions':
        return '76px';
      default:
        return 'auto';
    }
  }

  getHeaderLabel(column: string): string {
    switch(column) {
      case 'Réf.':
        return '#ID';
      case 'Société':
        return 'Client';
      case 'Date':
        return 'Issued Date';
      case 'Total TTC':
        return 'Total';
      case 'Mode Pay.':
        return 'Balance';
      case 'Actions':
        return 'Actions';
      default:
        return '';
    }
  }

  getHeaderSort(column: string): string {
    switch(column) {
      case 'Réf.':
        return 'descending';
      case 'Société':
      case 'NC':
      case 'Date':
      case 'Total TTC':
        return 'ascending';
      default:
        return '';
    }
  }

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
    let start = Math.max(this.currentPage - 2, 2);
    let end = Math.min(start + 4, totalPages - 1);
    if (this.currentPage < 4) {
      end = 5;
    }
    if (this.currentPage > totalPages - 4) {
      start = totalPages - 5;
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getPagesInRange(start: number, end: number): number[] {
    const pages = [];
    for (let i = start; i <= end; i++) {
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
      this.router.navigate(['invoice/formulaire-facture'], { state: { entrepriseId: this.selectedEntreprise?.idCompanie } });
    } else {
      console.error('Aucune entreprise sélectionnée.');
    }
  }

  updateInvoice(invoice: Invoice): void {
    if(this.authService.isAdmin()){
    this.selectedInvoice = invoice;
    this.isEditingInvoice = true;
    }else ('Vous etes pas autorisé')

  }

  deleteInvoice(invoice: Invoice): void {
    if (this.authService.isAdmin()) {
      this.selectedInvoice = invoice;
    this.isDeletingInvoice = true;
    }else('Vous etes pas autorisé')
  
  }

  confirmDeleteInvoice(): void {
    if (this.authService.isAdmin()) {
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
    }else('Vous etes pas autorisé')

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
        return invoice.items.length;
      case 'Date':
        return invoice.date.toLocaleDateString();
      case 'Nbr articles':
        let totalQuantity = 0;
        invoice.items.forEach(item => {
          totalQuantity += item.quantity;
        });
        return totalQuantity;
      case 'TVA':
        return 'TVA';
      case 'Total TTC':
        return invoice.totalTTC;
      case 'Date Pay.':
        return 'Date Pay.';
      case 'Mode Pay.':
        return 'Mode Pay.';
      default:
        return '';
    }
  }

  getInvoicesByType(type: string): Invoice[] {
    return this.invoices.filter(invoice => invoice.type === type);
  }

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

  exportToExcel(): void {
    // Implémentez la logique d'exportation en format Excel ici
  }

  exportToPDF(): void {
    // Implémentez la logique d'exportation en format PDF ici
  }
}
