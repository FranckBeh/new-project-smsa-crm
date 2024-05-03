import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import { InvoiceService } from './../invoice.service';
import { Societe } from './../invoice.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-formulaire-facture',
  templateUrl: './formulaire-facture.component.html',
  styleUrls: ['./formulaire-facture.component.scss'],
})
export class FormulaireFactureComponent implements OnInit {
  societeControl = new FormControl();
  filteredSocietes: Observable<Societe[]>;
  societes: Societe[] = []; // Votre tableau initial des sociétés
  invoiceForm: FormGroup;
  //private searchTerms = new Subject<string>(); // Subject pour observer les changements de saisie de l'utilisateur

  tva: number = 0;
  totalTTC: number = 0;
  tvaRate = new FormControl();
  searchTerm: FormControl = new FormControl();

  constructor(private fb: FormBuilder, private invoiceService: InvoiceService) {
    this.invoiceForm = this.fb.group({
      nomEntreprise: [''],
      adresseEntreprise: [''],
      invoiceState: ['', Validators.required],
      etatState: ['', Validators.required],
      isProForma: [false],
      reference: [{ value: '', disabled: true }],
      societe: ['', Validators.required],
      adresseParticulier: [''],
      creationDate: [this.getCurrentDate(), Validators.required],
      articles: this.fb.array([], Validators.minLength(1)),
      note: [''],
      tvaRate: [0],
      paymentDate: [''],
      paymentMethod:[''],
      comment:[''],
      totalHT: [''],
      totalTVA: [''],
      totalTTC: ['']

    });


  }

  ngOnInit(): void {
    this.addArticle();
    this.loadSocietes();
    this.filteredSocietes = this.societeControl.valueChanges.pipe(
      startWith(''),
      //map(value => typeof value === 'string' ? value : value.nom),
      //map(nom => nom ? this._filter(nom) : this.societes.slice())
      map(value => {
        const nom = typeof value === 'string' ? value : value.nom;
        return nom ? this._filter(nom as string) : this.societes.slice();
      }),
    );
    this.societeControl.valueChanges.subscribe(value => {
      // Logique à exécuter lors du changement de valeur
      this.displayFn(value);
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format ISO (YYYY-MM-DD)
  }

  get articles(): FormArray {
    return this.invoiceForm.get('articles') as FormArray;
  }


  loadSocietes(): void {
    this.invoiceService.getAllSocietes().subscribe((data: Societe[]) => {
      this.societes = data;
    });
  }

  //displayFn(value: any): string {return value && value.nom ? value.nom : ''; }


displayFn(societe?: Societe): string {
  //Votre logique pour retourner une chaîne de caractères basée sur l'objet Societe
  return societe && societe ? societe.nom : '';
}
  private _filter(nom: string): Societe[] {
    const filterValue = nom.toLowerCase();
    return this.societes.filter(societe => societe.nom.toLowerCase().includes(filterValue));
  }

  onSocieteSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedSociete = event.option.value as Societe;
    if (selectedSociete) {
      const selectedSocieteId = selectedSociete?.idSociete;
      console.log('ID de la société sélectionnée :', selectedSocieteId);
      this.invoiceForm.patchValue({
        societe: selectedSociete.idSociete,
        // Autres champs à mettre à jour si nécessaire
      });
    } else{
      console.log('Aucune société sélectionnée');
    }
  }





  addArticle() {
    this.articles.push(this.fb.group({
      designation: ['', Validators.required],
      priceSale: ['', [Validators.required, Validators.min(0)]],
      pricePurchase: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      tva: ['0', [Validators.min(0), Validators.max(100)]]
    }));
  }

  removeArticle(index: number) {
    this.articles.removeAt(index);
  }

  getTotalTTC(i: number): number {
    const article = this.articles.at(i);
    if (!article) return 0;

    const priceSale = article.get('priceSale')?.value || 0;
    const quantity = article.get('quantity')?.value || 0;
    const tva = article.get('tva')?.value || 0;

    const totalHT = priceSale * quantity;
    const totalTVA = totalHT * (tva / 100);
    const totalTTC = totalHT + totalTVA;

    return totalTTC;
  }

  getTotalTTC1(): number {
    let totalHT = 0;

    for (let i = 0; i < this.articles.length; i++) {
      const article = this.articles.at(i);
      const priceSale = article.get('priceSale')?.value;
      const quantity = article.get('quantity')?.value;

      totalHT += priceSale * quantity;
    }

    // Récupérer le taux de TVA sélectionné par l'utilisateur
    const tvaPercentage = parseFloat(this.invoiceForm.get('tvaRate')?.value);

    // Appliquer la TVA à la somme totale
    const totalTVA = totalHT * tvaPercentage;
    const totalTTC = totalHT + totalTVA;

    return totalTTC;
  }

  getTotalTVA(): number {
    // Calculer le montant total HT
    const totalHT = this.getTotalGeneralHT();

    // Récupérer le taux de TVA sélectionné par l'utilisateur
    const tvaPercentage = parseFloat(this.invoiceForm.get('tvaRate')?.value) || 0;

    // Calculer le montant de la TVA
    const totalTVA = totalHT * (tvaPercentage);
    return totalTVA;
  }

  calculateTotalTTC(): void {
    // Mettez à jour le total TTC chaque fois que le taux de TVA change
    this.totalTTC = this.getTotalTTC1();
  }

  getTotalGeneralHT(): number {
    const totalHt = this.articles.controls
      .map(control => control.value.priceSale * control.value.quantity)
      .reduce((acc, value) => acc + value, 0);
    return totalHt;
  }

  getArticleControl(index: number, field: string) {
    return this.articles.at(index)?.get(field) as FormControl;
  }

  onSubmit() {


    // Continuez avec le traitement du formulaire
    if (this.invoiceForm.valid) {
          // Obtenez la valeur du formulaire

    const formValue = this.invoiceForm.value;

    // Vérifiez d'abord si la société est définie et n'est pas vide
    if (formValue.societe) {
      const societeId = formValue.societe; // Ici, formValue.societe devrait être l'ID de la société
      console.log('ID de la société sélectionnée:', societeId);
    } else {
      // Gérez le cas où la société sélectionnée est vide ou non définie
      console.log('Aucune société sélectionnée ou société personnalisée.');
      return; // Arrêtez le traitement supplémentaire si aucune société n'est sélectionnée
    }
      console.log(this.invoiceForm.value);
      // Soumettez le formulaire ou effectuez d'autres opérations nécessaires
    } else {
      // Affichez des messages d'erreur ou marquez les contrôles de formulaire comme touchés si le formulaire est invalide
      this.markFormGroupTouched(this.invoiceForm);
    }
  }


  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(group => this.markFormGroupTouched(group as FormGroup));
      }
    });
  }
}
