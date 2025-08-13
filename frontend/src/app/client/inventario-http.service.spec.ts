import { TestBed } from '@angular/core/testing';

import { InventarioHttpService } from './inventario-http.service';

describe('InventarioHttpService', () => {
  let service: InventarioHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventarioHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
