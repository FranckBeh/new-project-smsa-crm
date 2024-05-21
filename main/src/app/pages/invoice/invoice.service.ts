import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { InvoicePreview, Societe } from './invoice.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private apiUrl = 'http://localhost:3000/invoices'; // L'URL de votre API backend
  private  apiUrlSociete= 'http://localhost:3000/societes'; // L'URL de societe

  private errorSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private societesSubject: BehaviorSubject<Societe[]> = new BehaviorSubject<Societe[]>([]);
  public societes$: Observable<Societe[]> = this.societesSubject.asObservable();
  // Observable public pour les erreurs
  public errorOccurred: Observable<string | null> = this.errorSubject.asObservable();

  private authService: AuthService;

  constructor(private http: HttpClient) {

    this.loadSocietes();
  }

  loadSocietes() {
    this.http.get<Societe[]>(this.apiUrlSociete).pipe(
      tap((societes: Societe[]) => this.societesSubject.next(societes)),
      catchError(this.handleError)
    ).subscribe();
  }
  searchSocietes(term: string): Observable<Societe[]> {
    return this.http.get<Societe[]>(`${this.apiUrlSociete}?term=${term}`).pipe(
      catchError(this.handleError)
    );
  }

  handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  getInvoiceCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/count`).pipe(
      catchError(this.handleError)
    );
  }

  getLastId(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lastId`).pipe(
      catchError(this.handleError)
    );
  }

  getInvoiceList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  getInvoiceData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/data`).pipe(
      catchError(this.handleError)
    );
  }

  getInvoiceDataById2(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/data/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getInvoiceDataById(id: number): Observable<InvoicePreview> {
    return this.http.get<InvoicePreview>(`${this.apiUrl}/data/${id}`);
  }
  searchInvoices(params: any): Observable<any> {
    let httpParams = new HttpParams();

    if (params.company) {
      httpParams = httpParams.set('company', params.company);
    }
    if (params.type) {
      httpParams = httpParams.set('type', params.type);
    }
    if (params.etat) {
      httpParams = httpParams.set('etat', params.etat);
    }
    if (params.reference) {
      httpParams = httpParams.set('reference', params.reference);
    }
    if (params.startDate) {
      httpParams = httpParams.set('startDate', params.startDate);
    }
    if (params.endDate) {
      httpParams = httpParams.set('endDate', params.endDate);
    }
    if (params.fixedDate) {
      httpParams = httpParams.set('fixedDate', params.fixedDate);
    }
    if (params.societeName) {
      httpParams = httpParams.set('societeName', params.societeName);
    }

    console.log('Paramètres de recherche envoyés :', params);
    return this.http.get(`${this.apiUrl}/searchInvoices`, { params: httpParams });
  }

  createInvoice(invoiceData: any): Observable<any> {
    // Récupérer l'ID de l'utilisateur

    // Ajouter l'ID de l'utilisateur aux données de la facture
    const data = { ...invoiceData };

    return this.http.post<any>(`${this.apiUrl}/createInvoice`, data).pipe(
      catchError(this.handleError)
    );
  }


  updateInvoice(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/edit/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

  deleteInvoice(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getExportInvoices(type: number, dateFrom: string, dateTo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/export?type=${type}&dateFrom=${dateFrom}&dateTo=${dateTo}`).pipe(
      catchError(this.handleError)
    );
  }

  getTotalRows(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/totalRows`).pipe(
      catchError(this.handleError)
    );
  }

  getListBy(where: string, limit: number, params: any[], orderby: string, whereByTTC: string): Observable<any[]> {
    const queryParams = params.join('&');
    return this.http.get<any[]>(`${this.apiUrl}/listBy?where=${where}&limit=${limit}&${queryParams}&orderby=${orderby}&whereByTTC=${whereByTTC}`).pipe(
      catchError(this.handleError)
    );
  }

  getFirstAvailableRef(type: number): Observable<any> {
    const currentYear = new Date().getFullYear();
    const url = `${this.apiUrl}/first-ref/${type}/${currentYear}`;
    return this.http.get<any>(url);
  }
  getLastAvailableRef(type: number): Observable<any> {
    const currentYear = new Date().getFullYear();
    const url = `${this.apiUrl}/last-ref/${type}/${currentYear}`;
    return this.http.get<any>(url);
  }


  getArticles(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/articles`).pipe(
      catchError(this.handleError)
    );
  }

  getCommentaires(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/commentaires`).pipe(
      catchError(this.handleError)
    );
  }

  addArticle(idInv: number, designation: string, postPrixUnit: number, prePrixUnit: number, quantite: number, autreQuantite: number = 1): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${idInv}/articles`, { designation, postPrixUnit, prePrixUnit, quantite, autreQuantite }).pipe(
      catchError(this.handleError)
    );
  }

  addCommentaire(idInv: number, IdUser: number, dateCommentaire: string, commentaire: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${idInv}/commentaires`, { IdUser, dateCommentaire, commentaire }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAllArticles(idInv: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idInv}/articles`).pipe(
      catchError(this.handleError)
    );
  }

  deleteAllCommentaires(idInv: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${idInv}/commentaires`).pipe(
      catchError(this.handleError)
    );
  }

  validateInvoice(idInv: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idInv}/validate`, {});
  }



  getAllSocietes(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.apiUrlSociete);
  }
}
