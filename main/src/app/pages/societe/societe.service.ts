import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Societe } from './societe.model';

@Injectable({
  providedIn: 'root'
})
export class SocieteService {
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

  getSociete(page: number, pageSize: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.apiUrlSociete}/list`, { params });
  }

  handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  deleteSociete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlSociete}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

}
