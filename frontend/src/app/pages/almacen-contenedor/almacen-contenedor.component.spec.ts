import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenContenedorComponent } from './almacen-contenedor.component';

describe('AlmacenContenedorComponent', () => {
  let component: AlmacenContenedorComponent;
  let fixture: ComponentFixture<AlmacenContenedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlmacenContenedorComponent]
    });
    fixture = TestBed.createComponent(AlmacenContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
