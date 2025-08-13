import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base


@Injectable({
  providedIn: 'root'
})
export class ClienteHttpService {

  constructor(private requestHttpService: RequestHttpService) {}
  
  public agregarCliente(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cliente/agregarCliente";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarClienteById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cliente/actualizarClienteById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public clienteById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cliente/clienteById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaClientesByEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cliente/listaClientesByEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public enviarDocumentoYOtpTraspasoById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cliente/enviarDocumentoYOtpTraspasoById";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public validarOTP(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cliente/validarOTP";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public enviarDocumentoYOtpVentaById(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/cliente/enviarDocumentoYOtpVentaById";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
