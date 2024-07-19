import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss']
})
export class PaymentModalComponent {
  paymentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PaymentModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentForm = this.fb.group({
      paymentDate: [this.getCurrentDate(), Validators.required],
      paymentMode: ['', Validators.required],
      paymentComment: ['']
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.dialogRef.close(this.paymentForm.value);
    }
  }
}
