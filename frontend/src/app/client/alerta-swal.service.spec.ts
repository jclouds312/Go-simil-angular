import { TestBed } from '@angular/core/testing';

import { AlertaSwalService } from './alerta-swal.service';

describe('AlertaSwalService', () => {
  let service: AlertaSwalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertaSwalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
