import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root'
})
export class RecetaHttpService {

  constructor(private requestHttpService: RequestHttpService) {}
  
  public agregarReceta(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/receta/agregarReceta";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public recetaById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/receta/recetaById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public documentoPdfRecetaById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/receta/documentoPdfRecetaById";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
