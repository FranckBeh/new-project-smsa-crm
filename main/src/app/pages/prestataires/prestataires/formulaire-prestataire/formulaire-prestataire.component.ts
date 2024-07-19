import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { PrestatairesService } from '../../prestataires.service';
import { DomaineActivite, Tag, Ville } from '../../prestataires.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulaire-prestataire',
  templateUrl: './formulaire-prestataire.component.html',
  styleUrls: ['./formulaire-prestataire.component.scss']
})
export class FormulairePrestataireComponent implements OnInit {
  prestataireForm: FormGroup;
  villes: Ville[] = [];
  domaines: DomaineActivite[] = [];
  tags: Tag[] = [];
  selectedFiles: File[] = []; // Pour stocker les fichiers sélectionnés
  selectedPhoto: File | null = null;
  selectedDocuments: File[] = [];

  constructor(private fb: FormBuilder, private dataService: PrestatairesService, private dialog: MatDialog, private router: Router) {
    this.prestataireForm = this.fb.group({
      nom: ['', Validators.required],
      ville: ['', Validators.required],
      telephone: ['', Validators.required],
      fax: [''],
      email: [''],
      adresse: [''],
      nomResponsable: ['', Validators.required],
      fonctionResponsable: [''],
      gsmResponsable: [''],
      emailResponsable: [''],
      remarques: [''],
      domaineActivite: [''],
      selectedDomaines: [[], Validators.required],
      motsCles: [''],
      selectedTags: [[], Validators.required],
      infosSupplementaires: this.fb.array([]), // Utilisation de FormArray
      documents: [null], // Champ pour les documents
      validite: [true],
      avis: [''],
      internet: [''],
      photo: [null], // Champ pour la photo
    });
  }

  ngOnInit(): void {
    this.loadTags();
    this.loadVilles();
    this.loadDomaines();
  }

  // Charger les tags depuis le service
  loadTags(): void {
    this.dataService.getTags().subscribe(
      data => this.tags = data,
      error => console.error('Erreur lors de la récupération des tags', error)
    );
  }

  // Charger les villes depuis le service
  loadVilles(): void {
    this.dataService.getVilles().subscribe(
      data => this.villes = data,
      error => console.error('Erreur lors de la récupération des villes', error)
    );
  }

  // Charger les domaines d'activité depuis le service
  loadDomaines(): void {
    this.dataService.getDomaines().subscribe(
      data => this.domaines = data,
      error => console.error('Erreur lors de la récupération des domaines', error)
    );
  }

  // Gestion de l'upload des fichiers
  onFileSelected(event: any, fieldName: string) {
    const files = event.target.files;
    if (fieldName === 'photo') {
      this.selectedPhoto = files[0]; // Si vous avez un champ pour une seule photo
    } else if (fieldName === 'documents') {
      this.selectedDocuments = files; // Si vous avez un champ pour plusieurs documents
    }
  }

  // Ajouter une nouvelle ligne d'information supplémentaire
  addInfo(): void {
    const infoGroup = this.fb.group({
      libelle: ['', Validators.required],
      information: ['', Validators.required]
    });
    this.infosSupplementaires.push(infoGroup);
  }

  // Supprimer une ligne d'information supplémentaire
  removeInfo(index: number): void {
    this.infosSupplementaires.removeAt(index);
  }

  get infosSupplementaires(): FormArray {
    return this.prestataireForm.get('infosSupplementaires') as FormArray;
  }

  // Soumission du formulaire
  onSubmit(): void {
    if (this.prestataireForm.valid) {
      const formData = new FormData();
      const formValues = this.prestataireForm.value;

      formData.append('nom', formValues.nom);
      formData.append('ville', formValues.ville);
      formData.append('telephone', formValues.telephone);
      formData.append('fax', formValues.fax);
      formData.append('email', formValues.email);
      formData.append('adresse', formValues.adresse);
      formData.append('nomResponsable', formValues.nomResponsable);
      formData.append('fonctionResponsable', formValues.fonctionResponsable);
      formData.append('gsmResponsable', formValues.gsmResponsable);
      formData.append('emailResponsable', formValues.emailResponsable);
      formData.append('remarques', formValues.remarques);
      formData.append('domaineActivite', formValues.domaineActivite);
      formData.append('selectedDomaines', JSON.stringify(formValues.selectedDomaines));
      formData.append('motsCles', formValues.motsCles);
      formData.append('selectedTags', JSON.stringify(formValues.selectedTags));
      formData.append('infosSupplementaires', JSON.stringify(formValues.infosSupplementaires));
      formData.append('validite', formValues.validite);
      formData.append('avis', formValues.avis);
      formData.append('internet', formValues.internet);

      // Ajout des fichiers au FormData
      if (this.selectedPhoto) {
        formData.append('photo', this.selectedPhoto);
      }

      // Ajoutez les documents sélectionnés
      if (this.selectedDocuments) {
        Array.from(this.selectedDocuments).forEach((file: File, index: number) => {
          formData.append(`documents`, file);
        });
      }

      console.log('les donnée envoyé', formData);

      this.dataService.createPrestataire(formData).subscribe(
        response => {
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Prestataire créé avec succès'
            }
          });
          this.router.navigate(['/prestataires']);
        },
        (error: HttpErrorResponse) => {
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Erreur lors de la création du prestataire',
              error
            }
          });
        }
      );
    }
  }

  onClearForm(): void {
    this.prestataireForm.reset();
    this.selectedFiles = []; // Réinitialisez les fichiers sélectionnés
  }

  onRemoveFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Supprimez le fichier sélectionné de la liste
  }
}
