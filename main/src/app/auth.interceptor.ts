import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    //console.log('Token from localStorage:', token); // Ajout du log

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
    //  console.log('Request with Authorization header:', cloned); // Ajout du log

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
