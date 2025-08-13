import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasoDetalleComponent } from './traspaso-detalle.component';

describe('TraspasoDetalleComponent', () => {
  let component: TraspasoDetalleComponent;
  let fixture: ComponentFixture<TraspasoDetalleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraspasoDetalleComponent]
    });
    fixture = TestBed.createComponent(TraspasoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
