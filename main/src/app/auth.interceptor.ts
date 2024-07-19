import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from './pages/auth/auth.service';
import { Router } from '@angular/router';
import { Observable, throwError, catchError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      if (this.authService.isTokenExpired(token)) {
        this.authService.logout();
        this.router.navigate(['/auth']);
        return throwError('Token expired');
      }

      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(cloned).pipe(
        catchError((error) => {
          if (error.status === 401 || error.status === 403) {
            this.authService.logout();
            this.router.navigate(['/auth']);
          }
          return throwError(error);
        })
      );
    } else {
      return next.handle(req);
    }
  }
}
