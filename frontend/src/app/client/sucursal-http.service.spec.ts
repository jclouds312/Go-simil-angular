import { TestBed } from '@angular/core/testing';

import { SucursalHttpService } from './sucursal-http.service';

describe('SucursalHttpService', () => {
  let service: SucursalHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SucursalHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
