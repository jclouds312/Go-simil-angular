import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenListaComponent } from './almacen-lista.component';

describe('AlmacenListaComponent', () => {
  let component: AlmacenListaComponent;
  let fixture: ComponentFixture<AlmacenListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlmacenListaComponent]
    });
    fixture = TestBed.createComponent(AlmacenListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
