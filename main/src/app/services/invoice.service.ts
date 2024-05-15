import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Invoice } from '../models/invoice.model'; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  getInvoiceDataById(id: number) {
    throw new Error('Method not implemented.');
  }
  private invoices: Invoice[] = []; // Simule une base de données pour stocker les factures

  constructor() { }

  getInvoices(): Observable<Invoice[]> {
    return of(this.invoices); // Retourne la liste des factures comme un Observable
  }

  createInvoice(invoice: Invoice): Observable<void> {
    this.invoices.push(invoice); // Ajoute une nouvelle facture à la liste
    return of(undefined); // Retourne un Observable de type 'void'
  }

  updateInvoice(invoice: Invoice): Observable<void> {
    // Recherche et met à jour la facture correspondante dans la liste
    const index = this.invoices.findIndex(i => i.id === invoice.id);
    if (index !== -1) {
      this.invoices[index] = invoice;
    }
    return of(undefined); // Retourne un Observable de type 'void'
  }

  deleteInvoice(invoiceId: number): Observable<void> {
    // Supprime la facture correspondante de la liste
    this.invoices = this.invoices.filter(i => i.id !== invoiceId);
    return of(undefined); // Retourne un Observable de type 'void'
  }
}
