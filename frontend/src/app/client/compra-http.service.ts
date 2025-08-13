import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root',
})
export class CompraHttpService {
  constructor(private requestHttpService: RequestHttpService) {}

  public agregarCompra(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/compra/agregarCompra';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaCompraByEstado(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/compra/listaCompraByEstado';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaCompraDetalleByIdCompra(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/compra/listaCompraDetalleByIdCompra';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaCompraProductoHistorialByProducto(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/compra/listaCompraProductoHistorialByProducto';

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
