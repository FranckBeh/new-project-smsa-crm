import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { InvoiceService } from '../invoice.service';
import {
  Articles,
  Invoice,
  InvoiceCopy,
  Listinvart,
  Societe,
} from '../invoice.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Entreprise } from '../../entreprises/entreprises.model';
import { EntrepriseService } from '../../entreprises/entreprises.service';
import { AuthService } from '../../auth/auth.service';
import { DialogComponent } from '../../../layouts/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ValidationErrors } from '@angular/forms';

// Assurez-vous d'importer votre service de facture

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-formulaire-facture.component.html',
  styleUrls: ['./../formulaire-facture/formulaire-facture.component.scss'],
})
export class EditFormulaireFactureComponent implements OnInit {
  editInvoiceForm: FormGroup;
  invoiceIdInv: any; // L'ID de la facture à modifier
  societeControl = new FormControl();
  filteredSocietes: Observable<Societe[]>;
  societes: Societe[] = []; // Votre tableau initial des sociétés
  //private searchTerms = new Subject<string>(); // Subject pour observer les changements de saisie de l'utilisateur

  tva: number = 0;
  totalTTC: number = 0;
  tvaRate = new FormControl();
  searchTerm: FormControl = new FormControl();
  entrepriseNom: string = '';
  entrepriseId: string = '';
  entreprises: Entreprise[] = [];
  entreprise: any;
  entrepriseRecuId: number;
  entrepriseSelectionnee: Entreprise | null = null;
  detailsEntreprise: any;
  private societeId: number;
  userId: string | null;
  data: any
  invoice: any;
  totalTVA: number;
  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private entrepriseService: EntrepriseService,
    public authService: AuthService,
    private router: Router, // Service pour interagir avec les données de facture
    private dialog: MatDialog
  ) {
    this.editInvoiceForm = this.fb.group({
      adresseEntreprise: [''],
      invoiceState: ['', Validators.required],
      etatState: [null],
      isProForma: [false],
      reference: ['', { disabled: true }],
      societe: ['', Validators.required],
      adresseParticulier: [''],
      nomSociete: [''],
      creationDate: [this.getCurrentDate(), Validators.required],
      articles: this.fb.array(
        [],
        [Validators.minLength(1), Validators.required]
      ),
      note: [null],
      tvaRate: ['',Validators.required],
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
  isDataLoaded: boolean = false;
  ngOnInit(): void {
    this.invoiceIdInv = +this.route.snapshot.params['id'];
   //this.loadInvoiceData(this.invoiceIdInv);
    this.userId = this.authService.getUserId();
    this.addArticle();
    this.loadSocietes();
    this.filteredSocietes = this.societeControl.valueChanges.pipe(
      startWith(''),
      //map(value => typeof value === 'string' ? value : value.nom),
      //map(nom => nom ? this._filter(nom) : this.societes.slice())
      map((value) => {
        const nom = typeof value === 'string' ? value : value.nom;
        return nom ? this._filter(nom as string) : this.societes.slice();
      })
    );
    this.societeControl.valueChanges.subscribe((value) => {
      // Logique à exécuter lors du changement de valeur
      this.displayFn(value);
    });

    this.loadEntreprises();

    //   this.loadEntrepriseDetails();


    this.invoiceService.getInvoiceDataById2(this.invoiceIdInv).subscribe(

      (invoice) => {
        // Utilisez les détails récupérés pour mettre à jour les contrôles du formulaire
        console.log('Données de la facture reçues :', invoice);
        const articleIds = invoice.listinvart.map((article: { idArticle: number; }) => article.idArticle);

        const creationDate = new Date(invoice.dateCreation); // Convertir la date en objet Date
       // Calcul de tvaRate
//let tvaRate = (invoice.tva / (invoice.totalTTC - invoice.tva)) * 100;
let tvaRate = invoice.tva;
// Arrondissement à deux décimales
let tvaRateOptionValue = tvaRate.toFixed(2);

this.societeId = invoice.nc === 1 ? 0 : invoice.nc;
        // Formater la date au format "yyyy-MM-dd"
        const formattedDate = this.formatDate(creationDate);
        this.editInvoiceForm.patchValue({
          adresseEntreprise: invoice.adresseSociete,
          invoiceState: invoice.type,
          etatState: invoice.etat,
          isProForma: invoice.isProFormat,
          reference: invoice.reference,
          societe: this.societeId,
          adresseParticulier: invoice.adresseSociete,
          nomSociete: invoice.autreSociete,
          creationDate: formattedDate,
          note: invoice.note,
          tvaRate: tvaRateOptionValue,
         // tvaRate: invoice.tva,
          paymentDate: invoice.paymentDate,
          paymentMethod: invoice.paymentMode,
          comment: invoice.paymentComment,
          totalHT: invoice.totalHT,
          totalTVA: invoice.tva,
          totalTTC: invoice.totalTTC,
          nomEntreprise: invoice.parametreCompanie.nomCompanie,
          idEntreprise: invoice.major
        }, //{ emitEvent: false }
      );

        // Construisez la FormArray pour les articles
        const articleControls = invoice.listinvart.map((article: {idArticle: number; designation: any; postPrixUnit: any; pricePurchase: any; quantite: any; tva: any; }) => this.fb.group({
          idArticle: article.idArticle,
          designation: article.designation,
          priceSale: article.postPrixUnit,
          pricePurchase: article.pricePurchase,
          quantity: article.quantite,
          tva: article.tva
        }));
        const articlesFormArray = this.fb.array(articleControls);
        this.editInvoiceForm.setControl('articles', articlesFormArray);
        console.log('Données de la facture reçues :', this.editInvoiceForm.value);
        const selectedSociete = this.societes.find(societe => societe.idSociete === this.societeId);
    if (selectedSociete) {
      // Affichez le nom de la société dans le champ de saisie
      this.societeControl.setValue(selectedSociete);
    }
    if (this.editInvoiceForm.value.tvaRate) {
      this.calculateTotalTTC();
      this.getTotalTVA();
    }
    this.isDataLoaded = true;
      },
      (error) => {
        console.error('Erreur lors du chargement des détails de la facture:', error);
        // Gérez les erreurs comme vous le souhaitez
      }
    );

    this.editInvoiceForm.get('invoiceState')?.valueChanges.subscribe(type => {
      if (type) {
        const idEntreprise = this.invoice.major; // Replace with the actual ID
        this.invoiceService.getLastAvailableRef(type, idEntreprise).subscribe(ref => {
          this.editInvoiceForm.patchValue({
            reference: ref
          });
        });
      }
    });


  }






  formatDate(date: Date): string {
    // Extraire les composants de date nécessaires
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois sont indexés à partir de zéro, donc ajoutez 1 et formatez pour avoir deux chiffres
    const day = date.getDate().toString().padStart(2, '0');

    // Concaténer les composants pour former la date au format "yyyy-MM-dd"
    return `${year}-${month}-${day}`;
  }



  loadEntreprises(): void {
    this.entrepriseService.entrepriseSelectionnee.subscribe((data) => {
      this.entreprise = data;
      console.log('Données reçues :', data);
      if (this.entreprise) {
        this.entrepriseService
          .getEntrepriseById(this.entreprise)
          .subscribe((entrepriseSelectionnee: Entreprise) => {
            // console.log('Entreprise récupérée :', entrepriseSelectionnee);
            // Mettre à jour le formulaire avec les détails de l'entreprise
            this.editInvoiceForm.patchValue({
              nomEntreprise: entrepriseSelectionnee.nomCompanie, // Assurez-vous que cette propriété est correctement définie dans votre modèle de formulaire
              idEntreprise: entrepriseSelectionnee.idCompanie, // Assurez-vous que cette propriété est correctement définie dans votre modèle de formulaire
              // Autres champs à mettre à jour si nécessaire
            });
            //  console.log('Valeurs du formulaire après mise à jour :', this.editInvoiceForm.value);
          });
      }
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format ISO (YYYY-MM-DD)
  }

  get articles(): FormArray {
    return this.editInvoiceForm.get('articles') as FormArray;
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
    return this.societes.filter((societe) =>
      societe.nom.toLowerCase().includes(filterValue)
    );
  }

  onSocieteSelected(event: MatAutocompleteSelectedEvent): void {
    let selectedSocieteId: number;

    if (this.societeId) {
      selectedSocieteId = this.societeId;
    } else {
      const selectedSociete = event.option.value as Societe;
      selectedSocieteId = selectedSociete.idSociete;
    }

    if (selectedSocieteId) {
      // Recherchez la société correspondante par ID
      const selectedSociete = this.societes.find(societe => societe.idSociete === selectedSocieteId);
      if (selectedSociete) {
        // Affichez le nom de la société dans le champ de saisie
        this.societeControl.setValue(selectedSociete);
      }
    } else {
      // console.log('Aucune société sélectionnée');
    }
  }


  addArticle() {
    this.articles.push(
      this.fb.group({
        designation: ['', Validators.required],
        priceSale: ['', [Validators.required, Validators.min(0)]],
        pricePurchase: ['', [Validators.required, Validators.min(0)]],
        quantity: ['', [Validators.required, Validators.min(1)]],
        tva: ['0', [Validators.min(0), Validators.max(100)]],
      })
    );
  }

  validateField(fieldName: string) {
    const control = this.editInvoiceForm.get(fieldName);
    if (control) {
      control.markAsTouched();
      control.updateValueAndValidity(); // Déclenche la validation
    }
  }

  removeArticle(index: number) {
    this.articles.removeAt(index);
  }



  getArticleControl(index: number, field: string) {
    return this.articles.at(index)?.get(field) as FormControl;
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
   // const tvaPercentage = parseFloat(this.editInvoiceForm.get('tvaRate')?.value) / 100;
   // const tvaPercentage = parseFloat(this.editInvoiceForm.get('tvaRate')?.value) ;
    // Appliquer la TVA à la somme totale
   // const totalTVA = totalHT * tvaPercentage;
   //const totalTTC = totalHT + totalTVA;
    const totalTTC = totalHT;

    return totalTTC;
  }

  getTotalTVA(): number {
    // Calculer le montant total HT
    const totalHT = this.getTotalGeneralHT();

    // Récupérer le taux de TVA sélectionné par l'utilisateur
  //  const tvaPercentage = parseFloat(this.editInvoiceForm.get('tvaRate')?.value) / 100 || 0;
  const tvaPercentage =
  parseFloat(this.editInvoiceForm.get('tvaRate')?.value);

    // Calculer le montant de la TVA
    //const totalTVA = totalHT * tvaPercentage;
    const totalTVA = tvaPercentage;
    return totalTVA;
  }

  calculateTotalTTC(): void {
    // Mettez à jour le total TTC chaque fois que le taux de TVA change
    this.totalTTC = this.getTotalTTC1();
  }

  getTotalGeneralHT(): number {
    const totalHt = this.articles.controls
      .map((control) => control.value.priceSale * control.value.quantity)
      .reduce((acc, value) => acc + value, 0);
    return totalHt;
  }


  updateTotals(): void {
    this.totalTTC = this.getTotalTTC1();
    this.totalTVA = this.getTotalTVA();

    // Mise à jour des valeurs dans le formulaire

  }

  onSubmit(): void {
    if (this.authService.isAdmin()) {
      if (this.editInvoiceForm.valid) {
        const formValue = this.editInvoiceForm.value;
  
        // Mise à jour des valeurs du formulaire pour les totaux
        this.updateTotals();
  
  
        // Préparation des articles avec les ID corrects
        const articlesWithIds = formValue.articles.map((article: { idArticle: any; designation: string; quantity: number; priceSale: number; }, index: any) => ({
          designation: article.designation,
          quantite: article.quantity,
          postPrixUnit: article.priceSale,
          autreQuantite: 1,
          idArticle: article.idArticle || null // Utilisez l'ID existant ou null pour les nouveaux articles
        }));
  
        // Réinitialiser les champs si invoice.etat est égal à 0
        if (formValue.etatState == 0) {
          formValue.paymentDate = null;
          formValue.paymentMethod = null;
          formValue.comment = '';
        }
  
        // Création de l'objet data pour la mise à jour
        const data: InvoiceCopy = {
          ...formValue,
          reference: formValue.reference,
          type: formValue.invoiceState,
          etat: formValue.etatState,
          isProFormat: formValue.isProForma,
          paymentMode: formValue.paymentMethod,
          isValidated: formValue.etatState === 1 ? 1 : 0,
          paymentComment: formValue.comment,
          paymentDate: formValue.paymentDate,
          date: formValue.creationDate,
          tva: formValue.tvaRate,
          totalTVA: formValue.tvaRate,
          footer: formValue.note,
          idSociete: formValue.societe,
          adresseSociete: formValue.adresseEntreprise,
          autreSociete: formValue.nomSociete,
          autreQuantiteTitle: null,
          idUser: this.userId,
          totalTTC: this.totalTTC,
          major: formValue.idEntreprise,
          articles: articlesWithIds,
        };
  
        // Appel du service pour mettre à jour la facture
        this.invoiceService.updateInvoice(this.invoiceIdInv, data).subscribe(
          response => {
            // Afficher le modal de succès
            this.dialog.open(DialogComponent, {
              data: {
                message: 'Facture Mise à jour avec succès'
              }
            });
  
            // Rediriger vers le composant principal
            this.router.navigate(['/invoice']);
          },
          error => {
            // Gestion des erreurs de soumission
            console.error('Erreur lors de la modification de la facture:', error);
            this.dialog.open(DialogComponent, {
              data: {
                message: 'Erreur lors de la modification de la facture'
              }
            });
          }
        );
      } else {
        // Gestion du formulaire invalide
        console.error("Le formulaire n'est pas valide");
        this.dialog.open(DialogComponent, {
          data: {
            message: "Le formulaire n'est pas valide"
          }
        });
      }
    } else {
      alert('Vous n\'êtes pas autorisé');
    }
  }
  

}
