import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Societe } from './societe.model';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SocieteService {
 private  apiUrlSociete= environment.apiUrl + 'societes'; // L'URL de societe

 // private apiUrlSociete = 'https://api.crm-smsa.com/societes' ;

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

  getSociete(page: number, pageSize: number, search?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.apiUrlSociete}/list`, { params });
  }

  handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  createSociete(societe: Societe): Observable<Societe> {
    return this.http.post<any>(`${this.apiUrlSociete}/create`, societe).pipe(
      catchError(this.handleError)
    );
  }

  updateSociete(idSociete: number, societe: Societe): Observable<Societe> {
    return this.http.put<Societe>(`${this.apiUrlSociete}/update/${idSociete}`, societe).pipe(
      catchError(this.handleError)
    );
  }

  deleteSociete(idSociete: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlSociete}/delete/${idSociete}`).pipe(
      catchError(this.handleError)
    );
  }
}
