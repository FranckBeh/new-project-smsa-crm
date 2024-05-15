import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router'; // Import NavigationEnd from @angular/router
import { CarteVisiteService } from './cartes-visites.service';
import { CarteVisites } from './carte-visites.model';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormulaireCartesVisitesComponent } from './formulaire-cartes-visites/formulaire-cartes-visites.component';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-cartes-visites',
  templateUrl: './cartes-visites.component.html',
  styleUrls: ['./cartes-visites.component.scss']
})
export class AppCartesVisitesComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  exportType: string = 'csv';
  carteVisites: CarteVisites[] = [];
  searchResults: any[] = [];
  defaultLogo = 'assets/images/logos/logo_smsa.png'; // Set default logo here

  constructor(
    private carteVisiteService: CarteVisiteService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCarteVisites();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onSearch(this.searchInput.nativeElement.value); // Use search input value
      }
    });
  }

  loadCarteVisites(): void {
    this.carteVisiteService.getCarteVisites().subscribe((carteVisites: CarteVisites[]) => {
      // If no logo provided, use default logo
      this.carteVisites = carteVisites.map((carteVisite: CarteVisites) => {
        if (!carteVisite.logo) {
          carteVisite.logo = this.defaultLogo;
        }
        return carteVisite;
      });
    });
  }

  onSearch(searchQuery: string): void {
    // Debounce search to avoid excessive API calls
    const debouncedSearch = this.carteVisiteService.searchDebounced(searchQuery);

    // Subscribe to the debounced search observable
    debouncedSearch.subscribe(
      (results: any[]) => {
        // If no logo provided, use default logo
        this.searchResults = results?.map((result: any) => {
          if (!result.logo) {
            result.logo = this.defaultLogo;
          }
          return result;
        });
      },
      (error: any) => {
        console.error('Error during search:', error);
      }
    );
  }




  openDialog(carteVisite: any): void {
    const dialogRef = this.dialog.open(FormulaireCartesVisitesComponent, {
      data: carteVisite ? { ...carteVisite } : {} // Pass the card data or an empty object if it's a new card
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadCarteVisites();
    });
  }

  exportToCsv(): void {
    const dataToExport = this.searchResults.length > 0 ? this.searchResults : this.carteVisites;

    const csvData = dataToExport.map(carteVisite => ({
      Nom: carteVisite.nom,
      Fonction: carteVisite.fonction,
      Adresse: carteVisite.adresse,
      Téléphone: carteVisite.tel,
      GSM: carteVisite.gsm,
      Fix: carteVisite.fax,
      Email: carteVisite.email,
      Web: carteVisite.web,
      Société: carteVisite.societe,
    }));

    const csvHeader = ['Nom', 'Fonction', 'Adresse', 'Téléphone', 'GSM', 'Fix', 'Email', 'Web', 'Société'] as const;
    const csvRows = [csvHeader.join(',')];

    csvData.forEach(data => {
      const values = csvHeader.map(header => data[header]);
      csvRows.push(values.join(','));
    });

    const csvContent = csvRows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'cartes_visites.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
}

exportToExcel(): void {
    const dataToExport = this.searchResults.length > 0 ? this.searchResults : this.carteVisites;

    const excelData = dataToExport.map(carteVisite => ({
      Nom: carteVisite.nom,
      Fonction: carteVisite.fonction,
      Adresse: carteVisite.adresse,
      Téléphone: carteVisite.tel,
      GSM: carteVisite.gsm,
      Fix: carteVisite.fax,
      Email: carteVisite.email,
      Web: carteVisite.web,
      Société: carteVisite.societe,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelDataBlob: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(excelDataBlob);
    link.download = 'cartes_visites.xlsx';
    link.click();
}

exportData(): void {
    if (this.exportType === 'csv') {
      this.exportToCsv();
    } else if (this.exportType === 'excel') {
      this.exportToExcel();
    }
}



}
