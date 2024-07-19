// cartevisite.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

// Importez l'interface CarteVisites (en supposant qu'elle soit définie ailleurs)
import { CarteVisites } from './carte-visites.model';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CarteVisiteService  {

 private apiUrl = 'https://api.crm-smsa.com/cartesvisites';

// private apiUrl = environment.apiUrl + 'cartesvisites' || 'https://api.crm-smsa.com/cartesvisites';


  private carteVisitesSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public carteVisites$: Observable<any[]> = this.carteVisitesSubject.asObservable();


  constructor(private http: HttpClient) { }

  getCarteVisites(): Observable<CarteVisites[]> {
    return this.http.get<CarteVisites[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError<CarteVisites[]>('getCarteVisites')),
       // tap(_ => console.log('Cartes de visite récupérées')), // Journalisation optionnelle
      );
  }

  addCarteVisite(newCarteVisite: CarteVisites): Observable<any> {
    return this.http.post(this.apiUrl + '/create', newCarteVisite).pipe(
      catchError(this.handleError<any>('addCarteVisite'))
    );
  }

  search(query: string): Observable<CarteVisites[]> {
    const searchUrl = `${this.apiUrl}/search/${query}`;
    return this.http.get<CarteVisites[]>(searchUrl)
      .pipe(
        catchError(this.handleError<CarteVisites[]>('search')),
      //  tap(_ => console.log('Résultats de recherche récupérés')), // Journalisation optionnelle
      );
  }

  // Implémentation améliorée du debounce utilisant les opérateurs RxJS
  searchDebounced(query: string): Observable<CarteVisites[]> {
    return of(query) // Crée un observable de la requête de recherche
      .pipe(
        debounceTime(250), // Délai de 250 ms
        distinctUntilChanged(), // Émet uniquement si la requête change
        switchMap(q => this.search(q)), // Utilisez la méthode search pour effectuer la recherche
        catchError(this.handleError<CarteVisites[]>('searchDebounced')), // Gestion des erreurs
       /// tap(_ => console.log('Requête de recherche différée :', query)), // Journalisation optionnelle
      );
  }


  updateCarteVisite(carteVisite: CarteVisites): Observable<any> {
    const updateUrl = `${this.apiUrl}/${carteVisite.IdCarte}`;
    return this.http.put(updateUrl, carteVisite).pipe(
      catchError(error => {
        console.error('Erreur lors de la mise à jour de la carte de visite :', error);
        return throwError(error);
      })
    );
  }
  refreshCarteVisites(): void {
    this.http.get<any[]>(this.apiUrl).pipe(
      tap(data => console.log('Data fetched:', data)), // Log data
      catchError(error => {
        console.error('Error fetching data:', error);
        return of([]); // Return empty array if error occurs
      })
    ).subscribe(data => {
      this.carteVisitesSubject.next(data); // Update the subject with fetched data
    });
  }
  // Gestionnaire d'erreurs générique
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    //  console.error(`${operation} a échoué :`, error);
      return of(result as T);
    };
  }
}
