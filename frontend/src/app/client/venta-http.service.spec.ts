import { TestBed } from '@angular/core/testing';

import { VentaHttpService } from './venta-http.service';

describe('VentaHttpService', () => {
  let service: VentaHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentaHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
