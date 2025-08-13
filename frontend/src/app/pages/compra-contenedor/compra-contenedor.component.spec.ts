import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraContenedorComponent } from './compra-contenedor.component';

describe('CompraContenedorComponent', () => {
  let component: CompraContenedorComponent;
  let fixture: ComponentFixture<CompraContenedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraContenedorComponent]
    });
    fixture = TestBed.createComponent(CompraContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
