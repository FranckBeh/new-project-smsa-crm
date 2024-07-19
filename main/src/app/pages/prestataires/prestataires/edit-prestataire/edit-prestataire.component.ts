import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrestatairesService } from '../../prestataires.service';
import { DomaineActivite, Tag, Ville, PrestataireDetail, AutresPrestDetail } from '../../prestataires.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';

@Component({
  selector: 'app-edit-prestataire',
  templateUrl: './edit-prestataire.component.html',
  styleUrls: ['./edit-prestataire.component.scss']
})
export class EditPrestataireComponent implements OnInit {
  prestataireForm: FormGroup;
  prestataireId: number;
  villes: Ville[] = [];
  domaines: DomaineActivite[] = [];
  tags: Tag[] = [];
  selectedFiles: File[] = [];
  selectedPhoto: File | null = null;
  selectedDocuments: File[] = [];

  constructor(
    private fb: FormBuilder,
    private dataService: PrestatairesService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
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
      infosSupplementaires: this.fb.array([]), // Utilisation de FormArray pour les informations supplémentaires
      documents: [null],
      validite: [true],
      avis: [''],
      internet: [''],
      photo: [null],
    });

    this.prestataireId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadPrestataire();
    this.loadTags();
    this.loadVilles();
    this.loadDomaines();
  }

  loadPrestataire(): void {
    this.dataService.getPrestataireById(this.prestataireId).subscribe(
      (data: PrestataireDetail) => {
        this.prestataireForm.patchValue({
          nom: data.nom,
          ville: data.villeNom,
          telephone: data.fix,
          fax: data.fax,
          email: data.email,
          adresse: data.adresse,
          nomResponsable: data.nomResponsable,
          fonctionResponsable: data.fonctionResponsable,
          gsmResponsable: data.gsmResponsable,
          emailResponsable: data.mailResponsable,
          remarques: data.remarques,
          domaineActivite: data.domainesActivite.map(domaine => domaine.nom),
          selectedDomaines: data.domainesActivite.map(domaine => domaine.id),
          motsCles: data.tags.map(tag => tag.nom).join(', '),
          selectedTags: data.tags.map(tag => tag.id),
          validite: !data.blacklist,
          avis: data.aviscons,
          internet: data.infonet,
          documents: data.documents.map(doc => doc.nomFichier),
          photo: null, // À remplir si vous avez la photo
        });

        // Remplir les informations supplémentaires
        this.fillInfosSupplementaires(data.autresPrest);

        // Vérifie si les villes sont déjà chargées
        if (this.villes.length > 0) {
          this.patchVilleValue(data.villeId);
        }
        this.selectedDocuments = data.documents.map(doc => ({
          name: doc.nomFichier,
          id: doc.id
        })) as any[];
      },
      (error: HttpErrorResponse) => {
        console.error('Erreur lors de la récupération du prestataire', error);
        this.dialog.open(DialogComponent, {
          data: {
            message: 'Erreur lors de la récupération du prestataire',
            error
          }
        });
      }
    );
  }

  fillInfosSupplementaires(infos: AutresPrestDetail[]): void {
    const infosFGs = infos.map(info => this.fb.group({
      libelle: info.cle,
      information: info.valeur
    }));
    const infosFormArray = this.fb.array(infosFGs);
    this.prestataireForm.setControl('infosSupplementaires', infosFormArray);
  }
  

  loadTags(): void {
    this.dataService.getTags().subscribe(
      data => this.tags = data,
      error => console.error('Erreur lors de la récupération des tags', error)
    );
  }

  loadVilles(): void {
    this.dataService.getVilles().subscribe(
      (data: Ville[]) => {
        this.villes = data;
        // Une fois les villes chargées, chargez le prestataire
        this.loadPrestataire();
      },
      (error) => {
        console.error('Erreur lors du chargement des villes:', error);
      }
    );
  }

  patchVilleValue(villeId: number): void {
    const ville = this.villes.find(v => v.NumVille === villeId);
    if (ville) {
      this.prestataireForm.patchValue({ ville: ville.NumVille });
    }
  }

  loadDomaines(): void {
    this.dataService.getDomaines().subscribe(
      data => this.domaines = data,
      error => console.error('Erreur lors de la récupération des domaines', error)
    );
  }

  addInfo(): void {
    const infoGroup = this.fb.group({
      libelle: ['', Validators.required],
      information: ['', Validators.required]
    });
    this.infosSupplementaires.push(infoGroup);
  }

  removeInfo(index: number): void {
    this.infosSupplementaires.removeAt(index);
  }

  get infosSupplementaires(): FormArray {
    return this.prestataireForm.get('infosSupplementaires') as FormArray;
  }

  onFileSelected(event: any, fieldName: string) {
    const files = event.target.files;
    if (fieldName === 'photo') {
      this.selectedPhoto = files[0];
    } else if (fieldName === 'documents') {
      this.selectedDocuments = files;
    }
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.prestataireForm.patchValue({
        photo: file
      });
    }
  }

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

      if (this.selectedPhoto) {
        formData.append('photo', this.selectedPhoto);
      }

      if (this.selectedDocuments) {
        Array.from(this.selectedDocuments).forEach((file: File, index: number) => {
          formData.append('documents', file);
        });
      }

      console.log('Les données envoyées', formData);

      this.dataService.updatePrestataire(this.prestataireId, formData).subscribe(
        response => {
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Prestataire mis à jour avec succès'
            }
          });
          this.router.navigate(['/prestataires']);
        },
        (error: HttpErrorResponse) => {
          console.error('Erreur lors de la mise à jour du prestataire', error);
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Erreur lors de la mise à jour du prestataire',
              error
            }
          });
        }
      );
    }
  }

  onClearForm(): void {
    this.prestataireForm.reset();
    this.selectedFiles = [];
  }

  onRemoveFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
}
