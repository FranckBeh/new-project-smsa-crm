import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent implements OnInit  {
  loginData = {
    login: '',
    password: ''
  };

  constructor(private authService: AuthService) {}
  ngOnInit(): void {

  }

  login(): void {
    this.authService.login(this.loginData).subscribe(
      () => {
        console.log('Login successful');
        // Rediriger l'utilisateur vers une autre page après la connexion réussie si nécessaire
      },
      error => {
        console.error('Login failed:', error);
        // Afficher un message d'erreur à l'utilisateur si la connexion échoue
      }
    );
  }
}
