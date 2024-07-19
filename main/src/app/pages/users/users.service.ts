import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Utilisateur } from './users.model';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  //private apiUrl = environment.apiUrl +'user'; // Remplacez par l'URL de votre API pour les utilisateurs
 private apiUrl = 'https://api.crm-smsa.com/user' ;

  constructor(private http: HttpClient) { }

  handleError(error: any): Observable<never> {
    console.error('Une erreur s\'est produite :', error);
    return throwError('Quelque chose s\'est mal passé ; veuillez réessayer ultérieurement.');
  }

  getAllUsers(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/liste`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getPaginatedUsers(page: number, limit: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}`, { params: params });
  }




  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(user: Utilisateur): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
