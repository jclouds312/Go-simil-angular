import { TestBed } from '@angular/core/testing';

import { ProductoHttpService } from './producto-http.service';

describe('ProductoHttpService', () => {
  let service: ProductoHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
