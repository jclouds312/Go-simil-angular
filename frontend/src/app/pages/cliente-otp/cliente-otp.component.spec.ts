import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteOtpComponent } from './cliente-otp.component';

describe('ClienteOtpComponent', () => {
  let component: ClienteOtpComponent;
  let fixture: ComponentFixture<ClienteOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteOtpComponent]
    });
    fixture = TestBed.createComponent(ClienteOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
