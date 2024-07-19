import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Entreprise } from './entreprises.model';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
 private apiUrl = 'https://api.crm-smsa.com/companies';

// private apiUrl = environment.apiUrl + 'companies' || 'https://api.crm-smsa.com/companies';


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

  createEntreprise(entreprise: Entreprise): Observable<Entreprise> {
    return this.http.post<Entreprise>(`${this.apiUrl}/create`, entreprise).pipe(
      catchError(this.handleError)
    );
  }

  getEntrepriseById(id: string): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  changerEntreprise(entreprise: Entreprise | null) {
  //  console.log('Objet entreprise émis :', entreprise);
    this.entrepriseSource.next(entreprise);
  }
  deleteEntreprise(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }



  updateEntreprise(id: number, entreprise: Entreprise): Observable<Entreprise> {
    return this.http.put<Entreprise>(`${this.apiUrl}/edit/${id}`, entreprise).pipe(
      catchError(this.handleError)
    );
  }


}
