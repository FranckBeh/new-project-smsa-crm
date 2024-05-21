import { Entreprise } from './entreprises.model';
import { EntrepriseService } from './entreprises.service';
// entreprise-modal.component.ts
import { EntrepriseModalComponent } from './entreprises-modal/entreprise-modal.component';
import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntrepriseCreateModalComponent } from './entreprises-modal/entreprise-create-modal.component';
//import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entreprise-modal',
  templateUrl: './entreprises.component.html',
})
export class EntrepriseComponent implements OnInit {
  entrepriseData = {
    nom: '',
    adresse: '',
    // Autres champs d'entreprise
  };

  entreprises: Entreprise[] = []; // Définir le tableau d'entreprises et initialiser à vide
  selectedEntreprise: Entreprise | null = null;



  constructor(
   // public activeModal: NgbActiveModal,

    private entrepriseService: EntrepriseService,
    private dialog: MatDialog,
    public authService: AuthService,) 
    { }

  ngOnInit(): void {
    this.getEntreprises(); 
    this.loadEntreprises();
  }

  getEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe(
      entreprises => {
        this.entreprises = entreprises; // Stocker les entreprises récupérées dans le tableau d'entreprises
      },
      error => {
        console.error('Erreur lors de la récupération des entreprises :', error);
      }
    );
  }
  loadEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe(
      data => this.entreprises = data,
      error => console.error('Erreur lors du chargement des entreprises', error)
    );
  }

  createEntreprise(entreprise: Entreprise): void {
    this.entrepriseService.createEntreprise(entreprise).subscribe(
      data => {
        console.log('Entreprise créée avec succès !', data);
        this.loadEntreprises();// Recharger la liste des entreprises
      },
      error => console.error('Erreur lors de la création de l\'entreprise', error)
    );
  }


 
  showDetails(entreprise: Entreprise): void {
    const dialogRef = this.dialog.open(EntrepriseModalComponent, {
      data: { ...entreprise, isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getEntreprises(); // Rafraîchir la liste après modification
      }
    });
  }

  editEntrepriseOld(entreprise: Entreprise): void {
    const dialogRef = this.dialog.open(EntrepriseModalComponent, {
      data: { ...entreprise, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEntreprises(); // Rafraîchir la liste après modification
      }
    });
  }

  openCreateModalOld(): void {
    const dialogRef = this.dialog.open(EntrepriseCreateModalComponent);
  
  }


  deleteEntrepriseOld(entreprise: Entreprise): void {
    const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?');
    if (confirmDelete) {
      this.entrepriseService.deleteEntreprise(entreprise.idCompanie).subscribe(() => {
        console.log('Entreprise supprimée avec succès !');
        this.getEntreprises(); // Rafraîchir la liste des entreprises après la suppression
      }, (error: any) => {
        console.error('Erreur lors de la suppression de l\'entreprise :', error);
      });
    }
  }

  //////////////////////////
  editEntreprise(entreprise: Entreprise): void {
    if (this.authService.isAdmin()) {
      const dialogRef = this.dialog.open(EntrepriseModalComponent, {
        width: '500px',
        data: entreprise
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadEntreprises();
        }
      });
    } else {
      alert('Accès interdit. Rôle administrateur requis');
    }
  }

  deleteEntreprise(entreprise: Entreprise): void {
    if (this.authService.isAdmin()) {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
        this.entrepriseService.deleteEntreprise(entreprise.idCompanie).subscribe(
          () => {
            this.loadEntreprises();
            alert('Entreprise supprimée avec succès');
          },
          error => console.error('Erreur lors de la suppression de l\'entreprise', error)
        );
      }
    } else {
      alert('Accès interdit. Rôle administrateur requis');
    }
  }

  openCreateModal(): void {
    if (this.authService.isAdmin()){
      const dialogRef = this.dialog.open(EntrepriseCreateModalComponent, {
        width: '500px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadEntreprises();
        }
      });
    }else {
      alert('Vous etes pas autorisé')
    }
   
  }
}
