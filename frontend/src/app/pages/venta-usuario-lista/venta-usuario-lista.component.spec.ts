import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaUsuarioListaComponent } from './venta-usuario-lista.component';

describe('VentaUsuarioListaComponent', () => {
  let component: VentaUsuarioListaComponent;
  let fixture: ComponentFixture<VentaUsuarioListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentaUsuarioListaComponent]
    });
    fixture = TestBed.createComponent(VentaUsuarioListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
