import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogActions, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-formulaire-societe',
  templateUrl: './formulaire-societe.component.html',
  styleUrls: ['./formulaire-societe.component.scss']
})
export class FormulaireSocieteComponent implements OnInit {
  societeForm: FormGroup;
  dialogRef: MatDialogRef<FormulaireSocieteComponent>;
  constructor(private fb: FormBuilder,
    dialogRef: MatDialogRef<FormulaireSocieteComponent>) {
      this.dialogRef = dialogRef;
    this.societeForm = this.fb.group({
      idSociete: ['', Validators.required],
      nom: ['', Validators.required],
      ice: ['', Validators.required],
      adresse: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.societeForm.valid) {
      console.log(this.societeForm.value);
      // Ici, vous pouvez appeler votre service pour enregistrer les données du formulaire
    }
  }

  onCancel(): void {
    this.dialogRef.close();  // Fermez le dialogue ici
  }
}
