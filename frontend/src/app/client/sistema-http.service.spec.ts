import { TestBed } from '@angular/core/testing';

import { SistemaHttpService } from './sistema-http.service';

describe('SistemaHttpService', () => {
  let service: SistemaHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SistemaHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
