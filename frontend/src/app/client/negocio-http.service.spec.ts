import { TestBed } from '@angular/core/testing';

import { NegocioHttpService } from './negocio-http.service';

describe('NegocioHttpService', () => {
  let service: NegocioHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NegocioHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
