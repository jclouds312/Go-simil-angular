import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root'
})
export class DescuentoHttpService {

  constructor(private requestHttpService: RequestHttpService) {}
  
  public agregarDescuento(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/descuento/agregarDescuento";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarEstadoById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/descuento/actualizarEstadoById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public descuentoById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/descuento/descuentoById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaDescuentoByEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/descuento/listaDescuentoByEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaDescuentoByProductoEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/descuento/listaDescuentoByProductoEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
