import { EntrepriseService } from './entreprises.service';
// entreprise-modal.component.ts

import { Component, OnInit } from '@angular/core';
//import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entreprise-modal',
  templateUrl: './entreprises.component.html',
  styleUrls: ['./entreprise-modal.component.css']
})
export class EntrepriseComponent implements OnInit {
  entrepriseData = {
    nom: '',
    adresse: '',
    // Autres champs d'entreprise
  };

  constructor(
   // public activeModal: NgbActiveModal,
    private entrepriseService: EntrepriseService) { }

  ngOnInit(): void {
  }

  createEntreprise(): void {
    this.entrepriseService.createEntreprise(this.entrepriseData).subscribe(() => {
      console.log('Entreprise créée avec succès !');
     // this.activeModal.close('Entreprise créée'); // Fermer le modal
    }, (error: any) => {
      console.error('Erreur lors de la création de l\'entreprise :', error);
    });
  }
}
