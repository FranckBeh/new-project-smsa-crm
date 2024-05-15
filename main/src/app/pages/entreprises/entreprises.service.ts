import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Entreprise } from './entreprises.model';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private apiUrl = 'http://localhost:3000/companies';

  private entrepriseSource = new BehaviorSubject<Entreprise | null>(null);
  entrepriseSelectionnee = this.entrepriseSource.asObservable();

  constructor(private http: HttpClient) { }

  handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }

  getEntreprises(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(`${this.apiUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  createEntreprise(entrepriseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, entrepriseData);
  }

  getEntrepriseById(id: string): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  changerEntreprise(entreprise: Entreprise | null) {
    console.log('Objet entreprise émis :', entreprise);
    this.entrepriseSource.next(entreprise);
  }
}
