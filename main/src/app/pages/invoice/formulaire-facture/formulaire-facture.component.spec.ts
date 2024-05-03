import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireFactureComponent } from './formulaire-facture.component';

describe('FormulaireFactureComponent', () => {
  let component: FormulaireFactureComponent;
  let fixture: ComponentFixture<FormulaireFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireFactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
