import { TestBed } from '@angular/core/testing';

import { CategoriaHttpService } from './categoria-http.service';

describe('CategoriaHttpService', () => {
  let service: CategoriaHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
