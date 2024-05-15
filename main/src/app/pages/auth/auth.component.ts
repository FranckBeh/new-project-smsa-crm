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
      //  console.log('Login successful');
        this.router.navigate(['/dashboard']); // Redirige vers le tableau de bord
      },
      error => {
       // console.error('Login failed:', error);
        // Afficher un message d'erreur à l'utilisateur si la connexion échoue
        this.errorMessage = 'La connexion a échoué. Veuillez réessayer.';
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
