import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root',
})
export class PrecioVentaHttpService {
  constructor(private requestHttpService: RequestHttpService) {}

  public agregarPrecioVenta(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/precioventa/agregarPrecioVenta';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarEstadoById(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/precioventa/actualizarEstadoById';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaPrecioVentaByEstado(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/precioventa/listaPrecioVentaByEstado';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaPrecioVentaByCostoEstado(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/precioventa/listaPrecioVentaByCostoEstado';

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
