import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescuentoListaComponent } from './descuento-lista.component';

describe('DescuentoListaComponent', () => {
  let component: DescuentoListaComponent;
  let fixture: ComponentFixture<DescuentoListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DescuentoListaComponent]
    });
    fixture = TestBed.createComponent(DescuentoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
