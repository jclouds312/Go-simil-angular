import { TestBed } from '@angular/core/testing';

import { AlmacenHttpService } from './almacen-http.service';

describe('AlmacenHttpService', () => {
  let service: AlmacenHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlmacenHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
