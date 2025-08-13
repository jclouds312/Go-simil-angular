import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteContenedorComponent } from './cliente-contenedor.component';

describe('ClienteContenedorComponent', () => {
  let component: ClienteContenedorComponent;
  let fixture: ComponentFixture<ClienteContenedorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteContenedorComponent]
    });
    fixture = TestBed.createComponent(ClienteContenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
