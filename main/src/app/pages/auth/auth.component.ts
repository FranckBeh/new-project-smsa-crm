import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent  {

  loginData = {
    login: '',
    password: ''
  };

  errorMessage: string;

  constructor(private authService: AuthService,
    private router: Router


  ) {}



  login(): void {
    this.authService.login(this.loginData).subscribe(
      () => {
        // Redirige vers le tableau de bord
        this.router.navigate(['/dashboard']);
      },
      error => {
        // Afficher un message d'erreur à l'utilisateur si la connexion échoue
        if (error.status === 404) {
          this.errorMessage = 'Login incorrect.';
        } else if (error.status === 403) {
          this.errorMessage = 'Utilisateur non autorisé.';
        } else if (error.status === 401) {
          this.errorMessage = 'Mot de passe incorrect.';
        } else {
          this.errorMessage = 'La connexion a échoué. Veuillez réessayer.';
        }
      }
    );
  }


  logout(): void {
    this.authService.logout();
   // console.log('Logout successful');
    // Rediriger l'utilisateur vers la page de connexion après la déconnexion réussie si nécessaire
    this.router.navigate(['/login']);
  }

}
