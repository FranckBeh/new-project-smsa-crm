import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { InvoiceService } from './../invoice.service';
import { Articles, Invoice, InvoiceCopy, Listinvart, Societe } from './../invoice.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { Entreprise } from '../../entreprises/entreprises.model';
import { EntrepriseService } from '../../entreprises/entreprises.service';
import { AuthService } from '../../auth/auth.service';
import { DialogComponent } from './../../../layouts/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-formulaire-facture',
  templateUrl: './formulaire-facture.component.html',
  styleUrls: ['./formulaire-facture.component.scss'],
})
export class FormulaireFactureComponent implements OnInit {
  @ViewChild('totalTTCElement') totalTTCElement: ElementRef;
  @ViewChild('totalTVAElement') totalTVAElement: ElementRef;
  societeControl = new FormControl();
  filteredSocietes: Observable<Societe[]>;
  societes: Societe[] = []; // Votre tableau initial des sociétés
  invoiceForm: FormGroup;

  tva: number = 0;
  totalTTC: number = 0;
  tvaRate = new FormControl();
  searchTerm: FormControl = new FormControl();
  entrepriseNom: string = '';
  entrepriseId: string = '';
  entreprises: Entreprise[] = [];
  entreprise: any;
  entrepriseSelectionnee: Entreprise | null = null;
  detailsEntreprise: any;

  userId: string | null;
  isValidated: number;

  constructor(private fb: FormBuilder,
              private invoiceService: InvoiceService,
              private entrepriseService: EntrepriseService,
              public authService: AuthService,
              private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
    this.invoiceForm = this.fb.group({
      adresseEntreprise: [''],
      invoiceState: ['', Validators.required],
      etatState: [null],
      isProForma: [false],
      reference: ['', { disabled: true }],
      societe: ['', Validators.required],
      adresseParticulier: [''],
      nomSociete: [''],
      creationDate: [this.getCurrentDate(), Validators.required],
      articles: this.fb.array([]),
      note: [null],
      tvaRate: [0],
      paymentDate: [null],
      paymentMethod: [null],
      comment: [null],
      totalHT: [''],
      totalTVA: [''],
      totalTTC: [''],
      nomEntreprise: ['', { disabled: true }],
      idEntreprise: ['', { disabled: true }],
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.addArticle();
    this.loadSocietes();
    this.filteredSocietes = this.societeControl.valueChanges.pipe(
      startWith(''),
      debounceTime(700),
      distinctUntilChanged(),
      map(value => {
        const nom = typeof value === 'string' ? value : value.nom;
        return nom ? this._filter(nom as string) : this.societes.slice();
      }),
    );
    this.societeControl.valueChanges.subscribe(value => {
      this.displayFn(value);
    });

    this.loadEntreprises();

    this.invoiceForm.get('invoiceState')?.valueChanges.subscribe(type => {
      if (type) {
        const idEntreprise = this.entreprise; // Replace with the actual ID
        this.invoiceService.getLastAvailableRef(type, idEntreprise).subscribe(ref => {
          this.invoiceForm.patchValue({
            reference: ref
          });
        });
      }
    });

  }

  loadEntreprises(): void {
    this.entrepriseService.entrepriseSelectionnee.subscribe(data => {
      this.entreprise = data;
      if (this.entreprise) {
        this.entrepriseService.getEntrepriseById(this.entreprise).subscribe((entrepriseSelectionnee: Entreprise) => {
          this.invoiceForm.patchValue({
            nomEntreprise: entrepriseSelectionnee.nomCompanie,
            idEntreprise: entrepriseSelectionnee.idCompanie,
          });
        });
      }
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  get articles(): FormArray {
    return this.invoiceForm.get('articles') as FormArray;
  }

  loadSocietes(): void {
    this.invoiceService.getAllSocietes().subscribe((data: Societe[]) => {
      this.societes = data;
    });
  }

  displayFn(societe?: Societe): string {
    return societe && societe.nom ? societe.nom : '';
  }

  private _filter(nom: string): Societe[] {
    const filterValue = nom.toLowerCase();
    return this.societes.filter(societe => societe.nom.toLowerCase().includes(filterValue));
  }

  onSocieteSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedSociete = event.option.value as Societe;
    if (selectedSociete) {
      this.invoiceForm.patchValue({
        societe: selectedSociete.idSociete,
      });
    }
  }

  addArticle() {
    this.articles.push(this.fb.group({
      designation: ['', Validators.required],
      priceSale: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
    }));
  }

  validateField(fieldName: string) {
    const control = this.invoiceForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity();
    }
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

    const tvaPercentage = parseFloat(this.invoiceForm.get('tvaRate')?.value) / 100 || 0;

   // const totalTVA = totalHT * tvaPercentage;
    // const totalTTC = totalHT + totalTVA//
    const totalTTC = totalHT ; // + totalTVA

    return totalTTC;
  }

  getTotalTVA(): number {
   // const totalHT = this.getTotalGeneralHT();
    const tvaPercentage = parseFloat(this.invoiceForm.get('tvaRate')?.value) || 0;
   // const totalTVA = totalHT * tvaPercentage;
    const totalTVA =tvaPercentage;
    return totalTVA;
  }

  calculateTotalTTC(): void {
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
    const totalTTC = this.getTotalTTC1();
   // const totalTVA = this.getTotalTVA();

    this.invoiceForm.patchValue({
      totalTTC: totalTTC,
     // totalTVA: totalTVA
    });

    if (this.invoiceForm.valid) {
      const formControls = this.invoiceForm.value;
      const articles: Articles[] = formControls.articles.map((article: { designation: string; quantity: number; priceSale: number; }) => ({
        designation: article.designation,
        quantite: article.quantity,
        postPrixUnit: article.priceSale,
        autreQuantite: 1
      }));

      if (this.authService.isAdmin()) {
        this.isValidated = formControls.paymentDate == null ? 0 : 1;
      } else {
        this.isValidated = 0;
      }

      const invoiceData: InvoiceCopy = {
        reference: formControls.reference,
        type: formControls.invoiceState,
        etat: formControls.etatState,
        isProFormat: formControls.isProForma,
        isValidated: this.isValidated,
        paymentMode: formControls.paymentMethod,
        paymentComment: formControls.comment,
        paymentDate: formControls.paymentDate,
        date: formControls.creationDate,
        tva: formControls.tvaRate,
        totalTVA: formControls.tvaRate,
        footer: formControls.note,
        idSociete: formControls.societe,
        adresseSociete: formControls.adresseEntreprise,
        autreSociete: formControls.nomSociete,
        autreQuantiteTitle: null,
        idUser: this.userId,
        totalTTC: formControls.totalTTC,
        major: formControls.idEntreprise,
        articles: articles,
      };
      this.invoiceService.createInvoice(invoiceData).subscribe(
        () => {
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Facture créée avec succès'
            }
          });
          this.router.navigate(['/invoice']);
        },
        error => {
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Erreur lors de la création de la facture'
            }
          });
        }
      );
    } else {
      this.markFormGroupTouched(this.invoiceForm);
    }

    if (!this.invoiceForm.valid) {
      Object.keys(this.invoiceForm.controls).forEach(key => {
        const controlErrors: ValidationErrors | null = this.invoiceForm.get(key)!.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
          //  console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
            this.dialog.open(DialogComponent, {
              data: {
                message: ['Erreur: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]]
              }
            });
          });
        }
      });
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
