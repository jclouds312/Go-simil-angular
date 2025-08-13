import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalContenedorComponent } from './sucursal-contenedor.component';

describe('SucursalContenedorComponent', () => {
  let component: SucursalContenedorComponent;
  let fixture: ComponentFixture<SucursalContenedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SucursalContenedorComponent]
    });
    fixture = TestBed.createComponent(SucursalContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
