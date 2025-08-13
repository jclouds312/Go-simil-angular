import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root',
})
export class NegocioHttpService {
  constructor(private requestHttpService: RequestHttpService) {}

  public whatsappIniciarSesion(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/negocio/whatsappIniciarSesion';

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
