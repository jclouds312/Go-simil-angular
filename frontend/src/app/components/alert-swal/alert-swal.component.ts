import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alert-swal',
  templateUrl: './alert-swal.component.html',
  styleUrls: ['./alert-swal.component.css']
})
export class AlertSwalComponent {
  mostrarErrorHttp(res: any): boolean {
    if (!res.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Mensaje de Error',
        text: `Error ${res.status}: ${res.message}`,
        confirmButtonText: 'Ok'
      });
      return true;
    }
    return false;
  }

  mostrarErrorApp(mensaje: string, codigo?: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Mensaje de Información',
      text: `${mensaje}${codigo ? ' - COD:' + codigo : ''}`,
      confirmButtonText: 'Ok'
    });
  }
}