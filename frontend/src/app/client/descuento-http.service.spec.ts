import { TestBed } from '@angular/core/testing';

import { DescuentoHttpService } from './descuento-http.service';

describe('DescuentoHttpService', () => {
  let service: DescuentoHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescuentoHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
