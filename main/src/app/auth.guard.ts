import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../app/pages/auth/auth.service'; // Assurez-vous que le chemin est correct

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isAuthenticated = this.authService.isAuthenticated(); // Cette méthode doit être définie dans votre service d'authentification
    console.log('Is user authenticated:', isAuthenticated); // Ajout du log
    if (isAuthenticated) {
      return true;
    } else {
      // Vérifier si la route est pour la page d'authentification ou pour la page d'inscription
      if (state.url.includes('/authentication') || state.url.includes('/auth')) {
        console.log('Access to authentication or registration page allowed'); // Ajout du log
        return true; // Autoriser l'accès à la page d'authentification ou d'inscription
      } else {
        console.log('User not authenticated, redirecting to login'); // Ajout du log
        this.router.navigate(['/auth']);
        return false;
      }

    
    }

    
  }

  // autres méthodes...
}
