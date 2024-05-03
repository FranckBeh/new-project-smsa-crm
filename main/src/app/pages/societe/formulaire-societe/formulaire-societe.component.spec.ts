import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireSocieteComponent } from './formulaire-societe.component';

describe('FormulaireSocieteComponent', () => {
  let component: FormulaireSocieteComponent;
  let fixture: ComponentFixture<FormulaireSocieteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireSocieteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireSocieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
