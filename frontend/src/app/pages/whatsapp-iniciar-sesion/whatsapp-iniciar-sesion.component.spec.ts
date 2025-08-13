import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappIniciarSesionComponent } from './whatsapp-iniciar-sesion.component';

describe('WhatsappIniciarSesionComponent', () => {
  let component: WhatsappIniciarSesionComponent;
  let fixture: ComponentFixture<WhatsappIniciarSesionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhatsappIniciarSesionComponent]
    });
    fixture = TestBed.createComponent(WhatsappIniciarSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
