import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root'
})
export class CategoriaHttpService {

  constructor(private requestHttpService: RequestHttpService) {}
  
  public agregarCategoria(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/categoria/agregarCategoria";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarCategoriaById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/categoria/actualizarCategoriaById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarEstadoById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/categoria/actualizarEstadoById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public categoriaById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/categoria/categoriaById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaCategoriaByEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/categoria/listaCategoriaByEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
