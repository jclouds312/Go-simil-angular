import { TestBed } from '@angular/core/testing';

import { CuentaHttpService } from './cuenta-http.service';

describe('CuentaHttpService', () => {
  let service: CuentaHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentaHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
