// Dans votre composant FormulaireSocieteComponent

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Societe } from './../societe.model'; // Assurez-vous d'importer correctement votre modèle Societe
import { SocieteService } from './../societe.service'; // Importez votre service SocieteService
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';

@Component({
  selector: 'app-formulaire-societe',
  templateUrl: './formulaire-societe.component.html',
  styleUrls: ['./formulaire-societe.component.scss']
})
export class FormulaireSocieteComponent implements OnInit {
  societeForm: FormGroup;
  isEditing: boolean;
  existingSociete: Societe; // Ajoutez cette variable pour stocker les données de la société existante

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<FormulaireSocieteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Societe,
    private societeService: SocieteService
  ) {
    this.isEditing = !!data;
    this.existingSociete = data; // Stockez les données de la société existante

    this.societeForm = this.fb.group({
      nom: [data?.nom || '', Validators.required],
      ice: [data?.ice || ''],
      adresse: [data?.adresse || '']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.societeForm.valid) {
      const updatedSociete: Societe = {
        nom: this.societeForm.value.nom,
        ice: this.societeForm.value.ice,
        adresse: this.societeForm.value.adresse,
        idSociete: this.existingSociete?.idSociete // Utilisez l'ID de la société existante
      };

      if (this.isEditing) {
        this.societeService.updateSociete(this.existingSociete.idSociete, updatedSociete).subscribe(
          () => {
          //  console.log('Société mise à jour avec succès :', updatedSociete);
            this.dialogRef.close();
            this.dialog.open(DialogComponent, {
              data: {
                message: 'Société mise à jour avec succès'
              }
            });
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de la société :', error);
            this.dialog.open(DialogComponent, {
              data: {
                message: 'Erreur lors de la mise à jour de la société'
              }
            });
          }
        );
      } else {
        this.societeService.createSociete(updatedSociete).subscribe(
          (createdSociete) => {
            console.log('Nouvelle société créée :', createdSociete);
            this.dialogRef.close();
            this.dialog.open(DialogComponent, {
              data: {
                message: 'Nouvelle société créée'
              }
            });
          },
          (error) => {
            console.error('Erreur lors de la création de la société :', error);
            this.dialog.open(DialogComponent, {
              data: {
                message: 'Erreur lors de la création de la société'
              }
            });
          }
        );
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}