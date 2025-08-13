import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertSwalComponent } from './alert-swal.component';

describe('AlertSwalComponent', () => {
  let component: AlertSwalComponent;
  let fixture: ComponentFixture<AlertSwalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertSwalComponent]
    });
    fixture = TestBed.createComponent(AlertSwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
