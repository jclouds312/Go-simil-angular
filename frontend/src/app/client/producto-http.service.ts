import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestHttpService } from './request-http.service'; // importa tu servicio base

@Injectable({
  providedIn: 'root'
})
export class ProductoHttpService {
  constructor(private requestHttpService: RequestHttpService) {}
  
  public agregarProducto(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/producto/agregarProducto";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarDatosProductodByid(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/producto/actualizarDatosProductodByid";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public actualizarPrecioPuntosdByid(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/producto/actualizarPrecioPuntosdByid";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaProductoByEstado(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/producto/listaProductoByEstado";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaInventarioProductoByAlmacenProducto(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/producto/listaInventarioProductoByAlmacenProducto";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaInventarioProductoByAlmacen(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/producto/listaInventarioProductoByAlmacen";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaInventarioProductoByProducto(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/producto/listaInventarioProductoByProducto";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaInventarioHistorialByInventario(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/producto/listaInventarioHistorialByInventario";

    return this.requestHttpService.postRequest(endpoint, param);
  }

  public listaInventarioHistorialByAlmacenProducto(param: any): Observable<any> {
    
    param["token"] = "1";
    const endpoint = "/producto/listaInventarioHistorialByAlmacenProducto";

    return this.requestHttpService.postRequest(endpoint, param);
  }
}
