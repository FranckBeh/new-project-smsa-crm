import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Societe } from './invoice.model';

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

  getInvoiceById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createInvoice(invoiceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, invoiceData).pipe(
      catchError(this.handleError)
    );
  }

  updateInvoice(id: number, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedData).pipe(
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

  getFirstAvailableRef(type: number, year: number | null = null, ref: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/firstAvailableRef?type=${type}&year=${year}&ref=${ref}`).pipe(
      catchError(this.handleError)
    );
  }

  getLastAvailableRef(type: number, year: number | null = null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/lastAvailableRef?type=${type}&year=${year}`).pipe(
      catchError(this.handleError)
    );
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

  pay(idInv: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${idInv}/pay`, {}).pipe(
      catchError(this.handleError)
    );
  }

  getAllSocietes(): Observable<Societe[]> {
    return this.http.get<Societe[]>(this.apiUrlSociete);
  }
}
