import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaProductoListaComponent } from './venta-producto-lista.component';

describe('VentaProductoListaComponent', () => {
  let component: VentaProductoListaComponent;
  let fixture: ComponentFixture<VentaProductoListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentaProductoListaComponent]
    });
    fixture = TestBed.createComponent(VentaProductoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
