import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaContenedorComponent } from './venta-contenedor.component';

describe('VentaContenedorComponent', () => {
  let component: VentaContenedorComponent;
  let fixture: ComponentFixture<VentaContenedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentaContenedorComponent]
    });
    fixture = TestBed.createComponent(VentaContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
