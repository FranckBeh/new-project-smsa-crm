import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Prestataire, PrestataireDetail } from './prestataires.model';

@Injectable({
  providedIn: 'root'
})
export class PrestatairesService {
  private apiUrl = 'http://localhost:3000/prestataires'; // URL de l'API
  private apiUrlTag= 'http://localhost:3000/tags';
  private apiUrlDomaines = 'http://localhost:3000/domaines';
  private apiUrlVilles = 'http://localhost:3000/villes';

  constructor(private http: HttpClient) {}

  getPrestataires(page: number, pageSize: number): Observable<{ data: Prestataire[], pagination: any }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<{ data: Prestataire[], pagination: any }>(`${this.apiUrl}/`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  searchPrestatairesold(query: string, page: number, pageSize: number): Observable<{ data: Prestataire[], pagination: any }> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<{ data: Prestataire[], pagination: any }>(`${this.apiUrl}/prestataires/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  searchPrestataires(query: string, option: string, page: number, pageSize: number): Observable<{ data: Prestataire[], pagination: any }> {
    const params = new HttpParams()
      .set('query', query)
      .set('option', option)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<{ data: Prestataire[], pagination: any }>(`${this.apiUrl}/prestataires/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }
  
  

  getTags(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlTag}/`);
  }

  getVilles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlVilles}/`);
  }

  getDomaines(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlDomaines}/`);
  }

  deletePrestataire(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getPrestataireById(id: number): Observable<PrestataireDetail> {
    return this.http.get<PrestataireDetail>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        throw 'Erreur lors de la récupération du prestataire par ID'; // Personnalisez selon votre logique d'erreur
      })
    );
  }

  createPrestataire(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/prestataires`, formData).pipe(
      catchError(this.handleError)
    );
  }

  updatePrestataire(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updatePrestataire/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erreur dans le service Prestataires:', error);
    return throwError(() => new Error('Une erreur est survenue, veuillez réessayer plus tard.'));
  }
}
