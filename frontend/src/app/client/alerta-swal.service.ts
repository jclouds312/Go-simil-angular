import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertaSwalService {
  mostrarErrorHttp(res: any): boolean {
//console.log(res)
    if (!res.ok) {
      let data:any;
      switch (parseInt(res.status)) {
        case 404:
          Swal.fire({
            icon: 'error',
            title: 'Mensaje de Error',
            text: `Error ${res.status}: ${res.message}`,
            confirmButtonText: 'Ok'
          });
          break;
        case 401:
          data = res.error;
          Swal.fire({
            icon: 'error',
            title: 'Acceso Denegado',
            text: `Error ${res.status}/${data.codigo}: ${res.message}/${data.mensaje}`,
            confirmButtonText: 'Ok'
          });
          break;
        case 500:
          data = res.error;
          Swal.fire({
            icon: 'error',
            title: 'Respuesta Inesperada',
            text: `Error ${res.status}/${data.codigo}: ${data.mensaje}`,
            confirmButtonText: 'Ok'
          });
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Error Desconocido',
            text: `Ocurrió un error inesperado (${res.status}): ${res.message}`,
            confirmButtonText: 'Ok'
          });
          break;
      }
      
      return true;
    }

    if (res.ok) {
      let data:any;
      switch (parseInt(res.status)) {
        case 200:
          data = res.body;
          if(data.estado == false){
            Swal.fire({
              icon: 'warning',
              title: 'Mensaje de Información',
              text: `COD: ${res.status}/${data.codigo}: ${data.mensaje}`,
              confirmButtonText: 'Ok'
            });
          }
          break;
        default:
          Swal.fire({
            icon: 'error',
            title: 'Error Desconocido',
            text: `Ocurrió un error inesperado (${res.status}): ${res.message}`,
            confirmButtonText: 'Ok'
          });
          break;
      }

      return !data.estado;

    }
    return false;
  }

}