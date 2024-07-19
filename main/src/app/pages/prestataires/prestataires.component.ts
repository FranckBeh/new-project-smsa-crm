import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrestatairesService } from './prestataires.service';
import { Prestataire } from './prestataires.model';
import { BehaviorSubject, Observable, EMPTY, Subject } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-prestataires',
  templateUrl: './prestataires.component.html',
  styleUrls: ['./prestataires.component.scss']
})
export class AppPrestatairesComponent implements OnInit {
  prestatairesSubject = new Subject<any[]>();
  prestataires$: Observable<Prestataire[]> = this.prestatairesSubject.asObservable();

  searchQuery = ''; // La chaîne de recherche pour la barre de recherche
  totalPrestataires = 0; // Nombre total de prestataires pour la pagination
  itemsPerPage = 10; // Nombre d'éléments par page pour la pagination
  currentPage = 1; // Page courante pour la pagination
  isLoading = false; // Indicateur de chargement
  errorMessage: string | null = null; // Message d'erreur
  searchOption: string = 'nom'; // Option de recherche par défaut

  constructor(
    private prestatairesService: PrestatairesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPrestataireList(); // Récupère la liste des prestataires lors de l'initialisation du composant
  }

  // Récupère la liste des prestataires avec pagination
  getPrestataireList(): void {
    this.isLoading = true; // Active l'indicateur de chargement
    this.errorMessage = null; // Réinitialise le message d'erreur

    if (this.searchQuery) {
      this.prestatairesService.searchPrestataires(this.searchQuery, this.searchOption, this.currentPage, this.itemsPerPage).pipe(
        catchError(error => {
          this.errorMessage = 'Erreur lors de la recherche des prestataires'; // Définit un message d'erreur en cas de problème
          return EMPTY; // Retourne un observable vide pour compléter le flux
        }),
        finalize(() => {
          this.isLoading = false; // Désactive l'indicateur de chargement une fois le flux terminé
        })
      ).subscribe(response => {
        if (response && response.pagination && response.data) {
          this.totalPrestataires = response.pagination.totalItems; // Met à jour le nombre total de prestataires
          this.prestatairesSubject.next(response.data); // Met à jour la liste des prestataires
        } else {
          this.errorMessage = 'Aucun prestataire trouvé'; // Définit un message d'erreur si aucun prestataire n'est trouvé
        }
      });
    } else {
      this.prestatairesService.getPrestataires(this.currentPage, this.itemsPerPage).pipe(
        catchError(error => {
          this.errorMessage = 'Erreur de récupération des données'; // Définit un message d'erreur en cas de problème
          return EMPTY; // Retourne un observable vide pour compléter le flux
        }),
        finalize(() => {
          this.isLoading = false; // Désactive l'indicateur de chargement une fois le flux terminé
        })
      ).subscribe(response => {
        if (response && response.pagination && response.data) {
          this.totalPrestataires = response.pagination.totalItems; // Met à jour le nombre total de prestataires
          this.prestatairesSubject.next(response.data); // Met à jour la liste des prestataires
        } else {
          this.errorMessage = 'Réponse du serveur invalide'; // Définit un message d'erreur si la réponse du serveur est invalide
        }
      });
    }
  }

  // Méthode de changement de page pour la pagination
  onPageChange(event: PageEvent): void {
    this.itemsPerPage = event.pageSize; // Met à jour le nombre d'éléments par page
    this.currentPage = event.pageIndex + 1; // Met à jour l'index de la page courante
    this.getPrestataireList(); // Récupère la liste des prestataires pour la nouvelle page
  }

  // Méthode pour supprimer un prestataire
  onDeletePrestataire(id: number): void {
    this.prestatairesService.deletePrestataire(id).pipe(
      catchError(error => {
        this.errorMessage = 'Erreur lors de la suppression du prestataire'; // Définit un message d'erreur en cas de problème
        return EMPTY; // Retourne un observable vide pour compléter le flux
      })
    ).subscribe(() => {
      this.getPrestataireList(); // Récupère la liste des prestataires après suppression
    });
  }

  // Méthode de recherche
  search(): void {
    this.currentPage = 1; // Réinitialise à la première page lors d'une nouvelle recherche
    this.getPrestataireList(); // Récupère la liste des prestataires basée sur la recherche
  }
}
