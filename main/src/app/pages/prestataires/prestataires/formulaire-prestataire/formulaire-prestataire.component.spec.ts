import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulairePrestataireComponent } from './formulaire-prestataire.component';

describe('FormulairePrestataireComponent', () => {
  let component: FormulairePrestataireComponent;
  let fixture: ComponentFixture<FormulairePrestataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulairePrestataireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulairePrestataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
