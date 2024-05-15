import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-dialog',
  template: `
    <h1 mat-dialog-title>Déconnexion</h1>
    <div mat-dialog-content>
      <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Annuler</button>
      <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Oui</button>
    </div>
  `
})
export class LogoutDialogComponent {

  constructor(public dialogRef: MatDialogRef<LogoutDialogComponent>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
