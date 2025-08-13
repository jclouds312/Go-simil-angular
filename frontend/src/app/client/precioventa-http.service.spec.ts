import { TestBed } from '@angular/core/testing';

import { PrecioventaHttpService } from './precioventa-http.service';

describe('PrecioventaHttpService', () => {
  let service: PrecioventaHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrecioventaHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
