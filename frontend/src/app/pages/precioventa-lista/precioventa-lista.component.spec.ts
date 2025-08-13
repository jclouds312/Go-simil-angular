import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecioventaListaComponent } from './precioventa-lista.component';

describe('PrecioventaListaComponent', () => {
  let component: PrecioventaListaComponent;
  let fixture: ComponentFixture<PrecioventaListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrecioventaListaComponent]
    });
    fixture = TestBed.createComponent(PrecioventaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
