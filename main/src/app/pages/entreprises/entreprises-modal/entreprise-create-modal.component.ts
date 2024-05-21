import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EntrepriseService } from '../entreprises.service';
import { Entreprise } from '../entreprises.model';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';

@Component({
  selector: 'app-entreprise-create-modal',
  templateUrl: './entreprise-create-modal.component.html',

})
export class EntrepriseCreateModalComponent implements OnInit {
  entrepriseForm: FormGroup;
  entreprises: Entreprise[] = [];
  constructor(
    private fb: FormBuilder,
    private entrepriseService: EntrepriseService,
    public dialogRef: MatDialogRef<EntrepriseCreateModalComponent>,
    private dialog: MatDialog
  ) {
    this.entrepriseForm = this.fb.group({
      nomCompanie: ['', Validators.required],
      adresseCompanie: [''],
      tel1Companie: [''],
      tel2Compnie: [''],
      email1Compagnie: [''],
      email2Compagnie: [''],
      sitewebCompagnie: [''],
      registreCommerce: [''],
      patente: [''],
      identifiantFiscal: [''],
      ice: ['']
    });
  }

  ngOnInit(): void {this.loadEntreprises();}
  loadEntreprises(): void {
    this.entrepriseService.getEntreprises().subscribe(
      data => this.entreprises = data,
      error => console.error('Erreur lors du chargement des entreprises', error)
    );
  }

  onSubmit(): void {
    if (this.entrepriseForm.valid) {
      this.entrepriseService.createEntreprise(this.entrepriseForm.value).subscribe(
        () => {
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Entrprise crée Mise à jour avec succès'
            }
          });
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Erreur lors de la création de l\'entreprise :', error);
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Erreur lors de la création de l\'entreprise :'
            }
          });
        }
      );
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
