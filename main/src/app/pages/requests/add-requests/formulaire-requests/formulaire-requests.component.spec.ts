import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireRequestsComponent } from './formulaire-requests.component';

describe('FormulaireRequestsComponent', () => {
  let component: FormulaireRequestsComponent;
  let fixture: ComponentFixture<FormulaireRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulaireRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
