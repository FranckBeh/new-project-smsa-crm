import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importez MatSnackBar
import { CarteVisiteService } from './../cartes-visites.service';

@Component({
  selector: 'app-formulaire-cartes-visites',
  templateUrl: './formulaire-cartes-visites.component.html',
})
export class FormulaireCartesVisitesComponent {

  constructor(
    private dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private carteVisiteService: CarteVisiteService,
    private snackBar: MatSnackBar // Injectez MatSnackBar
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveDialog(): void {
    if (this.data.IdCarte) {
      this.carteVisiteService.updateCarteVisite(this.data).subscribe(
        () => {
          this.snackBar.open('Carte de visite mise à jour avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close();
          this.carteVisiteService.refreshCarteVisites();
        },
        (error: any) => {
        //  console.error('Erreur lors de la mise à jour de la carte de visite :', error);
          this.snackBar.open('Erreur lors de la mise à jour de la carte de visite', 'Fermer', { duration: 3000 });
        }
      );
    } else {
      this.carteVisiteService.addCarteVisite(this.data).subscribe(
        () => {
          this.snackBar.open('Nouvelle carte de visite ajoutée avec succès', 'Fermer', { duration: 3000 });
          this.dialogRef.close();
          this.carteVisiteService.refreshCarteVisites();
        },
        (error: any) => {
         // console.error('Erreur lors de l\'ajout de la nouvelle carte de visite :', error);
          this.snackBar.open('Erreur lors de l\'ajout de la nouvelle carte de visite', 'Fermer', { duration: 3000 });
        }
      );
    }
  }
}
