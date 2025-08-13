import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentFiltroFechaComponent } from './component-filtro-fecha.component';

describe('ComponentFiltroFechaComponent', () => {
  let component: ComponentFiltroFechaComponent;
  let fixture: ComponentFixture<ComponentFiltroFechaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComponentFiltroFechaComponent]
    });
    fixture = TestBed.createComponent(ComponentFiltroFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
