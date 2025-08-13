import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappConfiguracionComponent } from './whatsapp-configuracion.component';

describe('WhatsappConfiguracionComponent', () => {
  let component: WhatsappConfiguracionComponent;
  let fixture: ComponentFixture<WhatsappConfiguracionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhatsappConfiguracionComponent]
    });
    fixture = TestBed.createComponent(WhatsappConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
