
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
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
  //private searchTerms = new Subject<string>(); // Subject pour observer les changements de saisie de l'utilisateur

  tva: number = 0;
  totalTTC: number = 0;
  tvaRate = new FormControl();
  searchTerm: FormControl = new FormControl();
  entrepriseNom: string = '';
  entrepriseId: string = '';
  entreprises: Entreprise[]=[] ;
  entreprise: any;
  entrepriseSelectionnee: Entreprise | null = null;
  detailsEntreprise: any;

  userId: string | null;

  constructor(private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private entrepriseService: EntrepriseService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute) {
    this.invoiceForm = this.fb.group({
      adresseEntreprise: [''],
      invoiceState: ['', Validators.required],
      etatState: [null],
      isProForma: [false],
      reference: ['',{ disabled: true }],
      societe: ['', Validators.required],
      adresseParticulier: [''],
      nomSociete: [''],
      creationDate: [this.getCurrentDate(), Validators.required],
      articles: this.fb.array([], [Validators.minLength(1),Validators.required]),
      note: [null],
      tvaRate: [0],
      paymentDate: [null],
      paymentMethod:[null],
      comment:[null],
      totalHT: [''],
      totalTVA: [''],
      totalTTC: [''],
      nomEntreprise: ['',{ disabled: true }],
      idEntreprise:['',{ disabled: true }],

    });


  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
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

    this.loadEntreprises();

 //   this.loadEntrepriseDetails();

 this.invoiceForm.get('invoiceState')?.valueChanges.subscribe(type => {
  if (type) {
    // Si un type est sélectionné, obtenez la première référence disponible pour ce type
    this.invoiceService.getLastAvailableRef(type).subscribe(ref => {
      // Mettez à jour le contrôle de formulaire 'reference' avec la référence obtenue
      this.invoiceForm.patchValue({ 
        reference: ref });
    });
  }
});


  }

  loadEntreprises(): void {
    this.entrepriseService.entrepriseSelectionnee.subscribe(data => {
      this.entreprise = data;
      console.log('Données reçues :', data);
      if (this.entreprise) {
        this.entrepriseService.getEntrepriseById(this.entreprise).subscribe((entrepriseSelectionnee: Entreprise) => {
         // console.log('Entreprise récupérée :', entrepriseSelectionnee);
          // Mettre à jour le formulaire avec les détails de l'entreprise
          this.invoiceForm.patchValue({
            nomEntreprise: entrepriseSelectionnee.nomCompanie, // Assurez-vous que cette propriété est correctement définie dans votre modèle de formulaire
            idEntreprise: entrepriseSelectionnee.idCompanie, // Assurez-vous que cette propriété est correctement définie dans votre modèle de formulaire
            // Autres champs à mettre à jour si nécessaire
          });
        //  console.log('Valeurs du formulaire après mise à jour :', this.invoiceForm.value);
        });
      }
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
    //  console.log('ID de la société sélectionnée :', selectedSocieteId);
      this.invoiceForm.patchValue({
        societe: selectedSociete.idSociete,
        // Autres champs à mettre à jour si nécessaire
      });
    } else{
    //  console.log('Aucune société sélectionnée');
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

  validateField(fieldName: string) {
    const control = this.invoiceForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity(); // Déclenche la validation
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

  onSubmitOld() {



    if (this.invoiceForm) {


      // Obtenez tous les contrôles du formulaire avec leurs valeurs
      const formControls = this.invoiceForm.value;

      // Affichez les valeurs dans la console ou effectuez toute autre opération nécessaire
      console.log('Contrôles du formulaire:', formControls);

      // Vous pouvez accéder à chaque contrôle individuellement ainsi :
      // const adresseEntrepriseValue = formControls['adresseEntreprise'].value;
      // const invoiceStateValue = formControls['invoiceState'].value;
      // et ainsi de suite...

      // Soumettez le formulaire ou effectuez d'autres opérations nécessaires
    } else {
      // Affichez des messages d'erreur ou marquez les contrôles de formulaire comme touchés si le formulaire est invalide
      this.markFormGroupTouched(this.invoiceForm);
    }
  }

  onSubmit() {
    
    const totalTTC = this.getTotalTTC1();

  // Récupérez le total de TVA
  const totalTVA = this.getTotalTVA();

  // Mettez à jour les valeurs dans le formulaire ou utilisez-les comme nécessaire
  this.invoiceForm.patchValue({
    totalTTC: totalTTC,
    totalTVA: totalTVA
  });

    if (this.invoiceForm) {
      // Obtenez tous les contrôles du formulaire avec leurs valeurs
      const formControls = this.invoiceForm.value;
      const articles: Articles[] = formControls.articles.map((article: { designation: string; quantity: number; priceSale: number;}) => ({
        designation: article.designation,
        quantite: article.quantity,
        postPrixUnit: article.priceSale,
        autreQuantite: 1
      }));

      const isValidated = formControls.paymentDate == null ? 0 : 1;


      
  
      // Créez un objet qui correspond à la structure de votre modèle de facture
      const invoiceData: InvoiceCopy = {
        reference: formControls.reference,
        type: formControls.invoiceState,
        etat: formControls.etatState,
        isProFormat: formControls.isProForma,
        isValidated: isValidated,
        paymentMode: formControls.paymentMethod,
        paymentComment: formControls.comment,
        paymentDate: formControls.paymentDate,
        date: formControls.creationDate,
        tva: formControls.totalTVA,
        totalTVA: formControls.tvaRate,
        footer: formControls.note,
        idSociete: formControls.societe,
        adresseSociete: formControls.adresseEntreprise,
        autreSociete: formControls.nomSociete,
        autreQuantiteTitle: null,
        idUser: this.userId,
        totalTTC: formControls.totalTTC,
        major: formControls.idEntreprise,
        articles: articles, // Utilisez le tableau d'objets Listinvart
      };
      console.log('Contrôles du formulaire:', invoiceData);
      // Soumettez le formulaire
      this.invoiceService.createInvoice(invoiceData).subscribe(
        () => {
          // Gestion de la réussite de la soumission
          console.log('Facture créée avec succès');
      
          // Afficher le modal
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Facture créée avec succès'
            }
          });
      
          // Rediriger vers le composant principal
          this.router.navigate(['/invoice']);
        },
        error => {
          // Gestion des erreurs de soumission
          console.error('Erreur lors de la création de la facture:', error);
          this.dialog.open(DialogComponent, {
            data: {
              message: 'Erreur lors de la création de la facture'
            }
          });
        }
      );

    } else {
      // Affichez des messages d'erreur ou marquez les contrôles de formulaire comme touchés si le formulaire est invalide
      this.markFormGroupTouched(this.invoiceForm);
    }
    if (!this.invoiceForm.valid) {
      Object.keys(this.invoiceForm.controls).forEach(key => {
        const controlErrors: ValidationErrors | null = this.invoiceForm.get(key)!.errors;
        if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
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
