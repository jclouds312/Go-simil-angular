import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root'
})
export class AlmacenHttpService {

  constructor(private requestHttpService: RequestHttpService) {}
  
  public agregarAlmacen(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/almacen/agregarAlmacen";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarAlmacenById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/almacen/actualizarAlmacenById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarEstadoById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/almacen/actualizarEstadoById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public almacenById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/almacen/almacenById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaAlmacenByEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/almacen/listaAlmacenByEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
