import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrestatairesService } from '../prestataires.service';
import { PrestataireDetail } from '../prestataires.model';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-prestataire-detail',
  templateUrl: './prestataire-detail.component.html',
  styleUrls: ['./prestataire-detail.component.scss']
})
export class PrestataireDetailComponent implements OnInit {

  prestataire: PrestataireDetail;
  pagedNotes: any[]; // Notes pour la page courante
  currentPage = 0;
  pageSize = 5; // Nombre d'éléments par page

  constructor(
    private route: ActivatedRoute,
    private prestatairesService: PrestatairesService
  ) { }

  ngOnInit(): void {
    this.getPrestataire();
  }

  getPrestataire(): void {
    const id = +this.route.snapshot.params['id'];
    this.prestatairesService.getPrestataireById(id)
      .subscribe({
        next: (prestataire) => {
          this.prestataire = prestataire;
          this.updateNotes();
        },
        error: (error) => {
          console.error('Erreur lors du chargement du prestataire :', error);
          // Gérez l'erreur de manière appropriée dans votre application
        }
      });
  }

  updateNotes(): void {
    // Calcule les notes pour la page courante
    const startIndex = this.currentPage * this.pageSize;
    this.pagedNotes = this.prestataire.notes.slice(startIndex, startIndex + this.pageSize);
  }

  pageChanged(event: any): void {
    this.currentPage = event.pageIndex;
    this.updateNotes();
  }
}
