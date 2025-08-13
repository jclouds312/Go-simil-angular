import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraNuevaComponent } from './compra-nueva.component';

describe('CompraNuevaComponent', () => {
  let component: CompraNuevaComponent;
  let fixture: ComponentFixture<CompraNuevaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraNuevaComponent]
    });
    fixture = TestBed.createComponent(CompraNuevaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
