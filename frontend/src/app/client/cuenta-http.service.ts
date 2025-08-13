import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root'
})
export class CuentaHttpService {
  constructor(private requestHttpService: RequestHttpService) {}
  
  public agregarCuenta(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cuenta/agregarCuenta";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public agregarCuentaHistorial(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cuenta/agregarCuentaHistorial";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public transferirSaldoCuentaByCuenta(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cuenta/transferirSaldoCuentaByCuenta";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaCuentaByEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cuenta/listaCuentaByEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaCuentaBySucursalEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cuenta/listaCuentaBySucursalEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaCuentaHistorialByIdCuenta(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cuenta/listaCuentaHistorialByIdCuenta";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaCuentaHistorialByInCuentas(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cuenta/listaCuentaHistorialByInCuentas";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
