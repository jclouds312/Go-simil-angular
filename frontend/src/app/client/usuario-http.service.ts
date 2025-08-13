import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root'
})
export class UsuarioHttpService {
  constructor(private requestHttpService: RequestHttpService) {}

  public agregarUsuario(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/agregarUsuario";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public agregarUsuarioSucursal(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/agregarUsuarioSucursal";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarUsuarioById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/actualizarUsuarioById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarEstadoById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/actualizarEstadoById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarSucursalEstadoById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/actualizarSucursalEstadoById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarPasswordById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/actualizarPasswordById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public usuarioByUsuarioPassword(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/usuarioByUsuarioPassword";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public usuarioLoginByIdLogin(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/usuarioLoginByIdLogin";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaUsuariosByEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/listaUsuariosByEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaSucursalByUsuario(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/usuario/listaSucursalByUsuario";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
