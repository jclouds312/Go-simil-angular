import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaHistorialComponent } from './cuenta-historial.component';

describe('CuentaHistorialComponent', () => {
  let component: CuentaHistorialComponent;
  let fixture: ComponentFixture<CuentaHistorialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentaHistorialComponent]
    });
    fixture = TestBed.createComponent(CuentaHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
