import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionListaComponent } from './comision-lista.component';

describe('ComisionListaComponent', () => {
  let component: ComisionListaComponent;
  let fixture: ComponentFixture<ComisionListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComisionListaComponent]
    });
    fixture = TestBed.createComponent(ComisionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
