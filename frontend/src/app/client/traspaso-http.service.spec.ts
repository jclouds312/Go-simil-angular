import { TestBed } from '@angular/core/testing';

import { TraspasoHttpService } from './traspaso-http.service';

describe('TraspasoHttpService', () => {
  let service: TraspasoHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraspasoHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
