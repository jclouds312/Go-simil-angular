import { TestBed } from '@angular/core/testing';

import { RequestHttpService } from './request-http.service';

describe('RequestHttpService', () => {
  let service: RequestHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
