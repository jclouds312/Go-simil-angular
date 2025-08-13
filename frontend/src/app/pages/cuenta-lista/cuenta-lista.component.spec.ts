import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaListaComponent } from './cuenta-lista.component';

describe('CuentaListaComponent', () => {
  let component: CuentaListaComponent;
  let fixture: ComponentFixture<CuentaListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CuentaListaComponent]
    });
    fixture = TestBed.createComponent(CuentaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
