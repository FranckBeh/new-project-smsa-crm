// auth.service.ts
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
}
