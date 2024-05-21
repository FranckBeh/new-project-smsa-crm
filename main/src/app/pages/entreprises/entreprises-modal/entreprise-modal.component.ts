import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EntrepriseService } from '../entreprises.service';
import { Entreprise } from '../entreprises.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';

interface EntrepriseModalData {
  isEditMode: boolean;
  entreprise: Entreprise;
}

@Component({
  selector: 'app-entreprise-detail-modal',
  templateUrl: './entreprise-modal.component.html',
  styleUrls: ['./entreprise-modal.component.css']
})
export class EntrepriseModalComponent {

  entrepriseForm: FormGroup;
  isEditMode : boolean;
  entreprises: Entreprise[] = [];

  constructor(
    public dialogRef: MatDialogRef<EntrepriseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Entreprise,
    private fb: FormBuilder,
    private entrepriseService: EntrepriseService,
    private dialog: MatDialog

  ) {
    this.isEditMode = data.isEditMode;
    this.entrepriseForm = this.fb.group({
      nomCompanie: [data.nomCompanie, Validators.required],
      adresseCompanie: [data.adresseCompanie],
      tel1Companie: [data.tel1Companie],
      tel2Compnie: [data.tel2Compnie],
      email1Compagnie: [data.email1Compagnie],
      email2Compagnie: [data.email2Compagnie],
      sitewebCompagnie: [data.sitewebCompagnie],
      registreCommerce: [data.registreCommerce],
      patente: [data.patente],
      identifiantFiscal: [data.identifiantFiscal],
      ice: [data.ice]
    });
  }

  ngOnInit(): void {this.loadEntreprises();}

  enableEditMode(): void {
    this.isEditMode = true;
  }

  loadEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe(
      data => this.entreprises = data,
      error => console.error('Erreur lors du chargement des entreprises', error)
    );
  }
  onSubmit(): void {
    if (this.entrepriseForm.valid) {
      this.entrepriseService.updateEntreprise(this.data.idCompanie, this.entrepriseForm.value).subscribe(
        () => {
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Entrprise crée Mise à jour avec succès'
            }
          });
          this.loadEntreprises();
          this.dialogRef.close(true);
        },
        (error) => {
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Erreur lors de la création de l\'entreprise '
            }
          });
          console.error('Erreur lors de la mise à jour de l\'entreprise :', error);
        }
      );
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
