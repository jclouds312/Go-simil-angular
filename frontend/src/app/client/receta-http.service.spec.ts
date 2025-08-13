import { TestBed } from '@angular/core/testing';

import { RecetaHttpService } from './receta-http.service';

describe('RecetaHttpService', () => {
  let service: RecetaHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecetaHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
