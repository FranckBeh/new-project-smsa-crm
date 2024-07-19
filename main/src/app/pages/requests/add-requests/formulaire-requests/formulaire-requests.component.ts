import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoteService } from '../../requests.service';
import { AuthService } from 'src/app/pages/auth/auth.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formulaire-requests',
  templateUrl: './formulaire-requests.component.html',
  styleUrls: ['./formulaire-requests.component.scss']
})
export class FormulaireRequestsComponent implements OnInit {
  form: FormGroup;
  idClient: number = 0;
  utilisateurs: any[] = [];
  filteredUtilisateurs: Observable<any[]>;
  villes: any[] = [];
  filteredVilles: Observable<any[]>;
  domaines: any[] = [];
  produits: any[] = [];
  filteredDomaines: Observable<any[]>;
  prestataires: any[] = [];
  filteredPrestataires: Observable<any[]>;
  filteredProduits: Observable<any[]>;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private backendService: NoteService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      date: [''],
      heure: [''],
      utilisateur: [''],
      ville: [''],
      domaine: [[]],  // Use an array to hold multiple selections
      prestataire: [''],
      produit: [''],
      contexte: [''],
      etat: [''],
      priorite: [''],
      prixAchat: [''],
      prixVente: [''],
      marge: [''],
      satisfaction: [''],
      commentaire: [''],
      actions: this.fb.array([])
    });
    this.idClient = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.form.patchValue({ utilisateur: this.currentUser.userId, ville: '37' });

    this.backendService.getUsers().subscribe((utilisateurs: any[]) => {
      this.utilisateurs = utilisateurs;
      this.filteredUtilisateurs = this.form.get('utilisateur')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, this.utilisateurs))
      );
    });

    this.backendService.getVilles().subscribe((villes: any[]) => {
      this.villes = villes;
      this.filteredVilles = this.form.get('ville')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filterVille(value, this.villes))
      );
    });

    this.backendService.getDomaines().subscribe((domaines: any[]) => {
      this.domaines = domaines;
      this.filteredDomaines = this.form.get('domaine')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, this.domaines))
      );
    });

    this.backendService.getPrestataires().subscribe((prestataires: any[]) => {
      this.prestataires = prestataires;
      this.filteredPrestataires = this.form.get('prestataire')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, this.prestataires))
      );
    });

    this.backendService.getProducts().subscribe((produits: any[]) => {
      this.produits = produits;
      this.filteredProduits = this.form.get('produit')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value, this.produits))
      );
    });
  }

  displayFn(option: any): string {
    return option && option.nom ? option.nom : '';
  }

  displayFn2(option: any): string {
    return option && option.NomVille ? option.NomVille : '';
  }




  private _filter(value: string, options: any[]): any[] {
    if (typeof value !== 'string') {
      return options;
    }
    const filterValue = value.toLowerCase();
    return options.filter(option => option.nom && option.nom.toLowerCase().includes(filterValue));
  }

  private _filterVille(value: string, options: any[]): any[] {
    if (typeof value !== 'string') {
      return options;
    }
    const filterValue = value.toLowerCase();
    return options.filter(option => option.NomVille && option.NomVille.toLowerCase().includes(filterValue));
  }



  get actions(): FormArray {
    return this.form.get('actions') as FormArray;
  }

  addAction(): void {
    this.actions.push(this.fb.group({
      action: ['']
    }));
  }

  removeAction(index: number): void {
    this.actions.removeAt(index);
  }

  calculateMarge(): void {
    const prixAchat = this.form.get('prixAchat')?.value;
    const prixVente = this.form.get('prixVente')?.value;
    if (prixAchat != null && prixVente != null) {
      const marge = prixVente - prixAchat;
      this.form.patchValue({ marge: marge });
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.backendService.createRequest(this.form.value).subscribe(
        (response: any) => {
          this.snackBar.open('Requête enregistrée avec succès', 'Fermer', { duration: 3000 });
          this.form.reset();
          this.form.patchValue({ utilisateur: this.currentUser.userId, ville: 'Casablanca' });
        },
        (error: any) => {
          this.snackBar.open('Erreur lors de l\'enregistrement de la requête', 'Fermer', { duration: 3000 });
        }
      );
    }
  }

  cancel(): void {
    this.form.reset();
    this.form.patchValue({ utilisateur: this.currentUser.userId, ville: '37' });
  }
}
