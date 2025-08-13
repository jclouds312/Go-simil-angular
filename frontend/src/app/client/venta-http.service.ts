import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root',
})
export class VentaHttpService {
  constructor(private requestHttpService: RequestHttpService) {}

  public agregarVenta(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/agregarVenta';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public agregarVentaCredito(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/agregarVentaCredito';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public agregarDevolucionVentaDetalleById(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/agregarDevolucionVentaDetalleById';

    return this.requestHttpService.postRequest(endpoint, param);
  }


  public actualizarEstadoComisionById(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/actualizarEstadoComisionById';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public ventaById(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/ventaById';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaVentaByEstado(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaVentaByEstado';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaVentaByOrigen(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaVentaByOrigen';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaVentaByCliente(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaVentaByCliente';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaVentaBySucursal(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaVentaBySucursal';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaVentaBySucursalUsuario(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaVentaBySucursalUsuario';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaVentaUsuarioBySucursalFechas(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaVentaUsuarioBySucursalFechas';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaVentaCreditoByIdVenta(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaVentaCreditoByIdVenta';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaProductoVentaBySucursalFechas(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaProductoVentaBySucursalFechas';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaVentaDetalleByIdProductoPagado(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaVentaDetalleByIdProductoPagado';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaComisionByComision(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/listaComisionByComision';

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public documentoPdfVentaById(param: any): Observable<any> {
    param['token'] = '1';
    const endpoint = '/venta/documentoPdfVentaById';

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
