import { TestBed } from '@angular/core/testing';

import { CompraHttpService } from './compra-http.service';

describe('CompraHttpService', () => {
  let service: CompraHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompraHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
