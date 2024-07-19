import { Utilisateur } from './users.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from './users.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
[x: string]: any;
 // users: MatTableDataSource<any>;
  userForm: FormGroup;
  editingUser: any = null;
  showForm: boolean = false;
  totalUsers: number = 0;
  pages: number[] = [];
  users: any[] = [];

  totalPages: number;
  currentPage: number = 1;
  limit: number = 10;

  displayedColumns: string[] = ['nom', 'prenom','login', 'email', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private fb: FormBuilder, private usersService: UsersService, public authService: AuthService, private router: Router) {
    this.userForm = this.fb.group({
      IdUser: [''],
      login: [''],
      password: [''],
      email: [''],
      tel: [''],
      prenom: [''],
      nom: [''],
      role: [''],
      online: [false],
      active: [false]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.loadUsers();
    }else{
      alert('accès non autorisé')
      this.router.navigate(['/']);}
  }

  loadUsers(): void {
    this.usersService.getPaginatedUsers(this.currentPage, this.limit).subscribe(
      response => {
        this.users = response.utilisateurs;
        this.totalPages = response.totalPages;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error => console.error(error)
    );
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onSubmit(): void {
    if (this.editingUser) {
      this.usersService.updateUser(this.userForm.value.IdUser, this.userForm.value).subscribe(
        () => this.loadUsers(),
        error => console.error('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur', error)
      );
    } else {
      this.usersService.createUser(this.userForm.value).subscribe(
        () => this.loadUsers(),
        error => console.error('Une erreur s\'est produite lors de la création de l\'utilisateur', error)
      );
    }
    this.showForm = false;
    this.userForm.reset();
  }

  editUser(user: any): void {
    this.userForm.reset();
    // Remplir le formulaire avec les données de l'utilisateur
    this.userForm.patchValue({
      IdUser: user.IdUser,
      login: user.login,
      email: user.email,
      tel: user.tel,
      prenom: user.prenom,
      nom: user.nom,
      role: user.role,
      online: user.online,
      active: user.active,
      password: '' // Réinitialiser le champ de mot de passe à une chaîne vide
  });
    this.editingUser = user;
    this.showForm = true;
  }

  deleteUser(id: string): void {
    this.usersService.deleteUser(id).subscribe(
      () => this.loadUsers(),
      error => console.error('Une erreur s\'est produite lors de la suppression de l\'utilisateur', error)
    );
  }

  showUserForm(): void {
    this.userForm.reset();
    this.editingUser = null;
    this.showForm = true;
  }
}
