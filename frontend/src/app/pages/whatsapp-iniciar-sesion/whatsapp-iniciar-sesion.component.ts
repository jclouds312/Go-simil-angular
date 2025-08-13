import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { NegocioHttpService } from '../../client/negocio-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-whatsapp-iniciar-sesion',
  templateUrl: './whatsapp-iniciar-sesion.component.html',
  styleUrls: ['./whatsapp-iniciar-sesion.component.css'],
})
export class WhatsappIniciarSesionComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  qrInicioSesion: any = '';
  lblQrInicioSesion: any = '';
  lblInicioSesion: any = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private negocioHttpService: NegocioHttpService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.whatsappIniciarSesion();
  }

  ngOnDestroy(): void {}

  whatsappIniciarSesion() {
    Swal.fire({
      title: 'Cargando...',
      html: 'Verificando el estado de Whatsapp...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
    };
    this.negocioHttpService
      .whatsappIniciarSesion(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        let mensaje = body.mensaje;
        Swal.close();
        console.log(data);
        console.log(mensaje);

        if (mensaje.toLowerCase().includes('escanea')) {
          this.qrInicioSesion = data['qr'];
          this.lblQrInicioSesion = mensaje;
        } else {
          this.lblInicioSesion = mensaje;
        }
      });
  }
}
