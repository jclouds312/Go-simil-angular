import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasoListaComponent } from './traspaso-lista.component';

describe('TraspasoListaComponent', () => {
  let component: TraspasoListaComponent;
  let fixture: ComponentFixture<TraspasoListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TraspasoListaComponent]
    });
    fixture = TestBed.createComponent(TraspasoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
