import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root'
})
export class SucursalHttpService {

  constructor(private requestHttpService: RequestHttpService) {}
  
  public agregarSucursal(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/sucursal/agregarSucursal";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public agregarSucursalAlmacen(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/sucursal/agregarSucursalAlmacen";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarSucursalById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/sucursal/actualizarSucursalById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarEstadoById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/sucursal/actualizarEstadoById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarAlmacenEstadoById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/sucursal/actualizarAlmacenEstadoById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public sucursalById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/sucursal/sucursalById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaSucursalByEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/sucursal/listaSucursalByEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaAlmacenBySucursal(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/sucursal/listaAlmacenBySucursal";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
