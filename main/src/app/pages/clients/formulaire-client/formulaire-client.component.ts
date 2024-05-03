import { Component, OnInit } from '@angular/core';
import { FormControlName,FormControl ,FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';;
import { ClientService } from '../clients.service';
import { Clients } from '../clients.model';

@Component({
  selector: 'app-formulaire-client',
  templateUrl: './formulaire-client.component.html',
  styleUrls: ['./formulaire-client.component.scss']
})
export class FormulaireClientComponent implements OnInit {
  clientForm: FormGroup;
currentStep = 1;
totalSteps = 4;

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.clientForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      type: ['', Validators.required],
      fixePerso: ['', Validators.required],
      fixePro: ['', Validators.required],
      mailPerso: ['', [Validators.required, Validators.email]],
      mailPro: ['', [Validators.required, Validators.email]],
      societe: ['', Validators.required],
      login: ['', Validators.required],
      expiration: ['', Validators.required],
      fonction: ['', Validators.required],
      inactif: ['', Validators.required],
      enfants: this.fb.array([], Validators.minLength(0))
    });
  }

  ngOnInit(): void {
    this.addChild();
  }



  onSubmit(): void {
    if (this.clientForm.valid) {
      const client: Clients = this.clientForm.value;
      this.clientService.createClient(client).subscribe(
        () => {
          console.log('Client created successfully');
          // Réinitialise le formulaire après soumission réussie
          this.clientForm.reset();
          // Réinitialise la progression du formulaire
          this.currentStep = 1;
        },
        (error: any) => {
          console.error('Error creating client:', error);
        }
      );
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    // Vous pouvez ajouter une logique de validation spécifique pour chaque étape ici si nécessaire
    return this.clientForm.valid;
  }

  get enfants() {
    return this.clientForm.get('enfants') as FormArray;
  }

  // Méthode pour ajouter un enfant
  addChild(): void {
    this.enfants.push(this.fb.group({
      nom: ['', Validators.required],
      dateNaissance: ['', Validators.required]
    }));
  }

  // Méthode pour supprimer un enfant en fonction de l'index i
  removeChild(i: number): void {

    this.enfants.removeAt(i);
  }
}
