import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVentaCreditoAgregarComponent } from './modal-venta-credito-agregar.component';

describe('ModalVentaCreditoAgregarComponent', () => {
  let component: ModalVentaCreditoAgregarComponent;
  let fixture: ComponentFixture<ModalVentaCreditoAgregarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalVentaCreditoAgregarComponent]
    });
    fixture = TestBed.createComponent(ModalVentaCreditoAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
