import { TestBed } from '@angular/core/testing';

import { WhatsappService } from './whatsapp.service';

describe('PreguntadosService', () => {
  let service: PreguntadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
