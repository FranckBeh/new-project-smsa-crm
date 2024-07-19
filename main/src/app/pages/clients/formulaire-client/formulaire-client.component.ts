import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ClientService } from '../clients.service';
import { ClientPayload, TypeClient, Clients } from '../clients.model';
import { Societe } from '../../invoice/invoice.model';
import { forkJoin, Observable, of } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, startWith, catchError } from 'rxjs/operators';
import { DialogComponent } from 'src/app/layouts/dialog/dialog.component';

@Component({
  selector: 'app-formulaire-client',
  templateUrl: './formulaire-client.component.html',
  styleUrls: ['./formulaire-client.component.scss']
})
export class FormulaireClientComponent implements OnInit {
  clientForm: FormGroup;
  typeClients: TypeClient[] = [];
  currentStep = 1;
  totalSteps = 4;
  societes: Societe[] = [];
  isLoginAvailable: boolean | undefined;
  loginChecked = false;
  searchControl = new FormControl();
  searchSocieteControl = new FormControl();
  filteredTypes: Observable<any[]>;
  filteredSocietes: Observable<any[]>;
  errorMessage: string | null = null;
  selectedClientId: number | null = null;
  isLoadingSocietes = false;
  isLoadingType: boolean;
  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ConfirmDialogComponent: MatDialog
  ) {
    this.clientForm = this.fb.group({
      clientData: this.fb.group({
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        typeclient_id: ['', Validators.required],
        fixePerso: [''],
        fixePro: [''],
        gsmPro: [''],
        gsmPerso: [''],
        mailPerso: [''],
        mailPro: [''],
        societe_id: ['', Validators.required],
        login: ['', Validators.required],
        expiration: ['', Validators.required],
        fonction: [''],
        situation: ['', Validators.required],
        civilite: ['', Validators.required],
        nbrEnfant: [''],
        type: [''],
        societe: ['']
      }),
      conjointData: this.fb.group({
        nom: [''],
        gsmPro: [''],
        anniversaire: [null],
        mail: ['', Validators.email],
        gsmPerso: ['']
      }),
      enfantsData: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.addChild();

    const clientId = this.route.snapshot.params['id'];
    this.selectedClientId = clientId;
    if (clientId) {
      forkJoin([
        this.clientService.loadTypeClient().pipe(catchError(error => of([]))),
        this.clientService.getAllSocietes().pipe(catchError(error => of([])))
      ]).subscribe(([types, societes]) => {
        this.typeClients = types;
        this.societes = societes;
        this.loadClientData(clientId);
      });
    } else {
      this.loadTypes();
      this.loadSocietes();
    }
    this.initializeFilters();
  }


  loadClientData(id: number): void {
    this.clientService.getClientById(id).subscribe(
      client => this.fillForm(client),
      error => {
        console.error('Erreur lors du chargement du client:', error);
        this.errorMessage = 'Erreur lors du chargement du client.';
      }
    );
  }

  fillForm(client: Clients): void {
    const selectedType = this.typeClients.find(type => type.NumType === client.typeclient.NumType);
    const selectedSociete = this.societes.find(societe => societe.idSociete === client.societe.idSociete);

    this.clientForm.patchValue({
      clientData: {
        nom: client.nom,
        prenom: client.prenom,
        typeclient_id: client.typeclient_id,
        fixePerso: client.fixePerso,
        fixePro: client.fixePro,
        gsmPro: client.gsmPro,
        gsmPerso: client.gsmPerso,
        mailPerso: client.mailPerso,
        mailPro: client.mailPro,
        societe_id: client.societe_id,
        login: client.login,
        expiration: client.expiration,
        fonction: client.fonction,
        situation: client.situation,
        civilite: client.civilite,
        nbrEnfant: client.nbrEnfant,
        type: selectedType || '',
        societe: selectedSociete || ''
      },
      conjointData: client.conjoint ? {
        nom: client.conjoint.nom,
        gsmPro: client.conjoint.gsmPro,
        anniversaire: client.conjoint.anniversaire,
        mail: client.conjoint.mail,
        gsmPerso: client.conjoint.gsmPerso
      } : {},
      enfantsData: client.enfants ? client.enfants.map(enfant => this.fb.group({
        nom: enfant.nom,
        anniversaire: enfant.anniversaire
      })) : []
    });

    this.clientForm.get('clientData.situation')?.valueChanges.subscribe(value => {
      if (['Marie', 'Concubinage'].includes(value)) {
        this.clientForm.get('conjointData')?.enable();
      } else {
        this.clientForm.get('conjointData')?.disable();
      }
    });

    this.clientForm.get('clientData.nbrEnfant')?.valueChanges.subscribe(value => {
      if (value === 'non') {
        this.enfants.clear();
      }
    });
  }


  private initializeFilters(): void {
    this.filteredTypes = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => this.filterTypes(value))
    );

    this.filteredSocietes = this.searchSocieteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(value => this.filterSocietes(value))
    );
  }

  private filterTypes(value: any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.NomType.toLowerCase();
    return this.typeClients.filter(type => type.NomType.toLowerCase().includes(filterValue));
  }

  private filterSocietes(value: any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.nom.toLowerCase();
    return this.societes.filter(societe => societe.nom.toLowerCase().includes(filterValue));
  }


  loadTypes(): void {
    this.isLoadingType = true; // Activation de l'indicateur de chargement
    this.clientService.loadTypeClient().subscribe(
      (types) => {
        this.typeClients = types;
        this.isLoadingSocietes = false; // Désactivation de l'indicateur de chargement
      },
      (error) => {
        console.error('Erreur lors du chargement des sociétés :', error);
        this.isLoadingType = false; // Désactivation de l'indicateur de chargement en cas d'erreur
      }
    );
  }

  onTypeSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedType = event.option.value;
    if (selectedType) {
      const selectedTypeId = selectedType.NumType;
      console.log('Selected type', selectedTypeId);
      this.clientForm.get('clientData')?.patchValue({
        typeclient_id: selectedTypeId
      });
    }
  }

  loadSocietes(): void {
    this.isLoadingSocietes = true; // Activation de l'indicateur de chargement
    this.clientService.getAllSocietes().subscribe(
      (societes) => {
        this.societes = societes;
        this.isLoadingSocietes = false; // Désactivation de l'indicateur de chargement
      },
      (error) => {
        console.error('Erreur lors du chargement des sociétés :', error);
        this.isLoadingSocietes = false; // Désactivation de l'indicateur de chargement en cas d'erreur
      }
    );
  }


  onSocieteSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedSociete = event.option.value;
    if (selectedSociete) {
      const selectedSocieteId = selectedSociete.idSociete;
      this.clientForm.get('clientData')?.patchValue({
        societe_id: selectedSocieteId
      });
    }
  }

  displayType(type: any): string {
    return type?.NomType ?? '';
  }

  displaySociete(societe: any): string {
    return societe?.nom ?? '';
  }

  checkLoginAvailability(): void {
    const login = this.clientForm.get('clientData.login')?.value;
    if (login) {
      this.clientService.checkLoginAvailability(login).pipe(
        catchError(error => {
          console.error('Erreur lors de la vérification du login:', error);
          this.errorMessage = 'Erreur lors de la vérification du login.';
          this.loginChecked = true;
          return of({ available: false });
        })
      ).subscribe(response => {
        this.isLoginAvailable = response?.available ?? false;
        this.loginChecked = true;
      });
    } else {
      this.isLoginAvailable = undefined;
      this.loginChecked = false;
    }
  }



  nextStep(): void {
    if (this.isStep1Valid()) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return this.isStep1Valid();
      default:
        return false;
    }
  }

  private isStep1Valid(): boolean {
    return (
      (this.clientForm.get('clientData.nom')?.valid ?? false) &&
      (this.clientForm.get('clientData.prenom')?.valid ?? false) &&
      (this.clientForm.get('clientData.login')?.valid ?? false) &&
      (this.clientForm.get('clientData.typeclient_id')?.valid ?? false) &&
      (this.clientForm.get('clientData.societe_id')?.valid ?? false) &&
      (this.clientForm.get('clientData.expiration')?.valid ?? false)
    );
  }





  get enfants(): FormArray {
    return this.clientForm.get('enfantsData') as FormArray;
  }

  addChild(): void {
    const enfantForm = this.fb.group({
      nom: [''],
      anniversaire: [null]
    });
    this.enfants.push(enfantForm);
  }

  removeChild(index: number): void {
    this.enfants.removeAt(index);
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const formValue = this.clientForm.value;
      const societeId = formValue.clientData.societe_id.idSociete;
      const typeId = formValue.clientData.typeclient_id.NumType;
      const clientData = {
        ...formValue.clientData,
        societe_id: societeId,
        typeclient_id: typeId
      };
console.log(formValue);
      if (!['Marie', 'Concubinage'].includes(formValue.clientData.situation)) {
        formValue.conjointData = null;
      }

      if (formValue.clientData.nbrEnfant === 'non') {
        formValue.enfantsData = [];
      }

      const payload: ClientPayload = {
        clientData: formValue.clientData,
        conjointData: formValue.conjointData,
        enfantsData: formValue.enfantsData
      };

      if (this.selectedClientId) {
        this.updateClient(this.selectedClientId, payload);
      } else {
        this.createClient(payload);
      }
    }
  }

  private updateClient(clientId: number, payload: ClientPayload): void {
    this.clientService.updateClient(clientId, payload).subscribe(
      response => {
        this.dialog.open(DialogComponent, {
          data: { message: 'Client mis à jour avec succès' }
        });
        this.router.navigate(['/clients']);
      },
      error => {
        console.error('Erreur lors de la mise à jour du client :', error);
        this.errorMessage = 'Erreur lors de la mise à jour du client.';
      }
    );
  }

  private createClient(payload: ClientPayload): void {
    this.clientService.createClient(payload).subscribe(
      response => {
        this.dialog.open(DialogComponent, {
          data: { message: 'Client créé avec succès' }
        });
        this.router.navigate(['/clients']);
      },
      error => {
        console.error('Erreur lors de la création du client :', error);
        this.errorMessage = 'Erreur lors de la création du client.';
      }
    );
  }

  onDeleteClient(clientId: number): void {
    const confirmationDialog = this.dialog.open(DialogComponent, {
      data: {
        title: 'Confirmation de suppression',
        message: 'Êtes-vous sûr de vouloir supprimer ce client ?',
      }
    });

    confirmationDialog.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteClient(clientId).subscribe(
          response => {
            this.dialog.open(DialogComponent, {
              data: {
                title: 'Suppression réussie',
                message: 'Le client a été supprimé avec succès.'
              }
            });
            this.router.navigate(['/clients']);
          },
          error => {
            console.error('Erreur lors de la suppression du client :', error);
            this.errorMessage = 'Erreur lors de la suppression du client.';
          }
        );
      }
    });
  }


}
