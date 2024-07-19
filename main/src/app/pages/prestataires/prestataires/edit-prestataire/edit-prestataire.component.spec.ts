import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrestataireComponent } from './edit-prestataire.component';

describe('EditPrestataireComponent', () => {
  let component: EditPrestataireComponent;
  let fixture: ComponentFixture<EditPrestataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPrestataireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPrestataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
