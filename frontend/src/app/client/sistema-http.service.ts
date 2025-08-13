// sistema-http.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base


@Injectable({
  providedIn: 'root'
})
export class SistemaHttpService {
  constructor(private requestHttpService: RequestHttpService) {}

  public version(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/sistema/version";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
