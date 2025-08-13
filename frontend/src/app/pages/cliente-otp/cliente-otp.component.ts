import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { ClienteHttpService } from '../../client/cliente-http.service';
import { TraspasoHttpService } from '../../client/traspaso-http.service';
import { VentaHttpService } from '../../client/venta-http.service';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-cliente-otp',
  templateUrl: './cliente-otp.component.html',
  styleUrls: ['./cliente-otp.component.css'],
})
export class ClienteOtpComponent implements OnInit, AfterViewInit, OnDestroy {
  txtCodigoOtp: any = '';

  tipo: any = '';
  idCliente: any = '';
  id: any = '';
  idTraspaso: any = '';
  idVenta: any = '';

  firmado: any = '';
  lblDocumento: any = '';
  lblTotal: any = '';
  lblTotalPuntos: any = '';
  lblFecha: any = '';

  lblOtpCliente: any = '';
  lblOtp: any = '';
  lblOtpCelular: any = '';
  lblOtpFecha: any = '';

  constructor(
    private paramGet: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private alertaSwalService: AlertaSwalService,
    private clienteHttpService: ClienteHttpService,
    private traspasoHttpService: TraspasoHttpService,
    private ventaHttpService: VentaHttpService
  ) {}

  ngOnInit(): void {
    this.paramGet.params.subscribe((params) => {
      this.tipo = params['tipo'];
      this.idCliente = params['idCliente'];
      this.id = params['id'];

      if (this.tipo == 'traspaso') {
        this.idTraspaso = this.id
      }

      if (this.tipo == 'venta') {
        this.idVenta = this.id
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.tipo == 'traspaso') {
      this.traspasoById();
    }

    if (this.tipo == 'venta') {
      this.ventaById();
    }
  }

  ngOnDestroy(): void {}

  click_enviarCodigo() {
    this.validarOTP();
  }

  ventaById() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
      idVenta: this.idVenta,
      idCliente: this.idCliente
    };
    this.ventaHttpService.ventaById(parametros).subscribe((res) => {
      if (this.alertaSwalService.mostrarErrorHttp(res)) {
        return;
      }

      const body = res.body;
      let data = body.data;
      let venta = data.venta;
      let totalPrecioFormato = data.totalPrecioFormato;
      let totalPuntos = data.totalPuntos;
      this.firmado = venta.firmado;

      this.lblDocumento = `Venta Nro. ${venta.idVenta}`;
      this.lblTotal = `${totalPrecioFormato}`;
      this.lblTotalPuntos = `${totalPuntos}`;
      this.lblFecha = `${venta.fechaTraspaso} - ${venta.horaTraspaso}`;

      this.lblOtpCliente = venta.nombreClienteOtp;
      this.lblOtp = venta.otpGenerado;
      this.lblOtpCelular = venta.celular;
      this.lblOtpFecha = `${venta.fechaRecibidoOtp} - ${venta.horaRecibidoOtp}`;
    });
  }

  traspasoById() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
      idTraspaso: this.idTraspaso,
      idCliente: this.idCliente
    };
    this.traspasoHttpService.traspasoById(parametros).subscribe((res) => {
      if (this.alertaSwalService.mostrarErrorHttp(res)) {
        return;
      }

      const body = res.body;
      let data = body.data;
      let traspaso = data.traspaso;
      let totalPrecioFormato = data.totalPrecioFormato;
      let totalPuntos = data.totalPuntos;
      this.firmado = traspaso.firmado;

      this.lblDocumento = `Traspaso Nro. ${traspaso.idTraspaso}`;
      this.lblTotal = `${totalPrecioFormato}`;
      this.lblTotalPuntos = `${totalPuntos}`;
      this.lblFecha = `${traspaso.fechaVenta} - ${traspaso.horaVenta}`;

      this.lblOtpCliente = traspaso.nombreClienteOtp;
      this.lblOtp = traspaso.otpGenerado;
      this.lblOtpCelular = traspaso.celular;
      this.lblOtpFecha = `${traspaso.fechaRecibidoOtp} - ${traspaso.horaRecibidoOtp}`;
    });
  }

  validarOTP() {
    Swal.fire({
      title: 'Enviando . . .',
      html: 'Aguarde unos segundos estamos validando el CODIGO',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idCliente: this.idCliente,
      idTraspaso: this.idTraspaso,
      idVenta: this.idVenta,
      otp: this.txtCodigoOtp,
      tipo: this.tipo,
      estado: '1'
    };
    this.clienteHttpService.validarOTP(parametros).subscribe((res) => {
      if (this.alertaSwalService.mostrarErrorHttp(res)) {
        return;
      }

      const body = res.body;
      let data = body.data;
      Swal.close();
      this.txtCodigoOtp = '';

      if (this.tipo == 'traspaso') {
        this.traspasoById();
      }

      if (this.tipo == 'venta') {
        this.ventaById();
      }

      this.toastr.success('OTP correcto');
    });
  }
}
