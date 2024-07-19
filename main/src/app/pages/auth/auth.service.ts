// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from 'src/app/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private apiUrl = environment.apiUrl + 'auth' || 'https://api.crm-smsa.com/auth';
//private apiUrl='https://api.crm-smsa.com/auth';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  private handleError(error: any): Observable<never> {
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
    }
  }

  login(loginData: { login: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userRole', data.userRole); // Stocker le rôle de l'utilisateur
      }),
      catchError(error => {
        this.handleError(error);
        throw error;
      })
    );
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    this.showMessage('Déconnexion réussie.');
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Administrateur';
  }

  isNotAdmin(): boolean {
    return this.getUserRole() !== 'Administrateur';
  }
  getCurrentUser(): any {
    const token = this.getToken();
    if (token) {
      // Décoder le token JWT pour obtenir les informations de l'utilisateur
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.userId; // Supposons que userId est le champ dans votre JWT pour l'identifiant de l'utilisateur
      return { userId }; // Vous pouvez retourner d'autres informations de l'utilisateur si nécessaire
    }
    return null; // Retourner null si aucun token n'est trouvé ou s'il est invalide
  }


  isTokenExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }
}
