import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  private handleError(error: any): Observable<never> {
    // console.error('An error occurred:', error);
    return throwError('Quelque chose s\'est mal passé; veuillez réessayer plus tard.');
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  checkResponseStatus(response: HttpResponse<any>): void {
    if (response.status === 401) {
      this.showMessage('Session expirée. Veuillez vous connecter à nouveau.');
      this.logout(); 
     // this.router.navigate(['/auth']); // Redirige vers la page de connexion
      
    }
  }

// Dans AuthService
login(loginData: { login: string, password: string }): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
    tap(data => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId); // Stocker l'ID de l'utilisateur
    }),
    catchError(error => {
      this.handleError(error);
      throw error;
    })
  );
}

getUserId(): string | null {
  const userId = localStorage.getItem('userId');
 // console.log('User ID:', userId); // Afficher l'ID de l'utilisateur dans la console
  return userId;
}



  logout(): void {
    localStorage.removeItem('token');
    // Effacer d'autres informations utilisateur stockées si nécessaire
    this.showMessage('Déconnexion réussie.');
    this.router.navigate(['/auth']); // Redirige vers la page de connexion
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Retourne `true` si le token existe, `false` sinon
  }
}
