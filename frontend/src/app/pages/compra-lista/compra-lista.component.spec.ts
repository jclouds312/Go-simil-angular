import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraListaComponent } from './compra-lista.component';

describe('CompraListaComponent', () => {
  let component: CompraListaComponent;
  let fixture: ComponentFixture<CompraListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompraListaComponent]
    });
    fixture = TestBed.createComponent(CompraListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
