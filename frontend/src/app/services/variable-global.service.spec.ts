import { TestBed } from '@angular/core/testing';

import { VariableGlobalService } from './variable-global.service';

describe('VariableGlobalService', () => {
  let service: VariableGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariableGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
