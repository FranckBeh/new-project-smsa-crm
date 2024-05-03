import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSocieteComponent } from './societe.component';

describe('SocieteComponent', () => {
  let component: AppSocieteComponent;
  let fixture: ComponentFixture<AppSocieteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSocieteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSocieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
