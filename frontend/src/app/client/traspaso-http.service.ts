import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root',
})
export class TraspasoHttpService {
  constructor(private requestHttpService: RequestHttpService) {}

  public agregarTraspaso(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/traspaso/agregarTraspaso';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public traspasoById(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/traspaso/traspasoById';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaTraspasoByEstado(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/traspaso/listaTraspasoByEstado';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaTraspasoByOrigen(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/traspaso/listaTraspasoByOrigen';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public documentoPdfTraspasoById(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/traspaso/documentoPdfTraspasoById';

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
