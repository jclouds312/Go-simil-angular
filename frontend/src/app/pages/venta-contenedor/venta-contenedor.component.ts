import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { ClienteHttpService } from '../../client/cliente-http.service';
import { VentaHttpService } from '../../client/venta-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-venta-contenedor',
  templateUrl: './venta-contenedor.component.html',
  styleUrls: ['./venta-contenedor.component.css']
})

export class VentaContenedorComponent implements OnInit, AfterViewInit, OnDestroy{
@ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  tipoAlmacenOrigen: any = '';

  idVenta = '';
  idAlmacenOrigen: any = '';
  idClienteOrigen: any = '';
  idCliente: any = '';

  firmado:any = "";

  btnVentaEnviarDocumento: any = '';
  lblVentaTipo: any = '';
  lblVentaOrigen: any = '';
  lblVentaDestino: any = '';
  lblVentaFecha: any = '';
  lblVentaHora: any = '';

  lblVentaClienteOTP: any = '';
  lblVentaOTP: any = '';
  lblVentaCelular: any = '';
  lblVentaFechaOTP: any = '';

  lblTotalPuntos: any = '';
  lblTotalCantidad: any = '';
  lblTotalPrecio: any = '';

  listaVentas: any = [];
  listaVentaDetalle: any = [];

  constructor(
    private paramGet: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private alertaSwalService: AlertaSwalService,
    private ventaHttpService: VentaHttpService,
    private clienteHttpService: ClienteHttpService
  ) {}

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalVentaDetalle').hasClass('show')) {
      $('#modalVentaDetalle').modal('hide');
    }
  }
  
  ngOnInit(): void {
    $('#modalVentaDetalle').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    this.paramGet.paramMap.subscribe((params) => {
      this.tipoAlmacenOrigen = params.get('tipoAlmacen');

      if (this.tipoAlmacenOrigen == 'almacen') {
        this.idAlmacenOrigen =
          this.paramGet.parent?.snapshot.paramMap.get('idAlmacen');
        this.idClienteOrigen = '1';
      }

      if (this.tipoAlmacenOrigen == 'cliente') {
        this.idClienteOrigen =
          this.paramGet.parent?.snapshot.paramMap.get('idCliente');
        this.idAlmacenOrigen = '1';
      }

      setTimeout(() => {
        this.listaVentaByOrigen();
      }, 200);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(environment.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  click_ventaDetalle(element: any) {
    this.idVenta = element.idVenta;
    this.ventaById();
    $('#modalVentaDetalle').modal('show');
  }

  click_enviarDocumentoYOtp(){
    this.enviarDocumentoYOtpVentaById();
  }

  click_generarDocumentoPdf(){
    this.documentoPdfVentaById();
  }

  ventaById() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
      idVenta: this.idVenta,
    };
    this.ventaHttpService.ventaById(parametros).subscribe((res) => {
      if (this.alertaSwalService.mostrarErrorHttp(res)) {
        return;
      }

      const body = res.body;
      let data = body.data;
      let venta = data.venta;
      this.listaVentaDetalle = data.detalle;
      this.lblTotalPuntos = data.totalPuntos;
      this.lblTotalCantidad = data.totalCantidad;
      this.lblTotalPrecio = data.totalPrecioFormato;

      this.idCliente = venta.idCliente;
      this.firmado = venta.firmado;
      this.lblVentaTipo = `${venta.tipoOrigen} - ${venta.tipoDestino}`;
      this.lblVentaOrigen = `${venta.tipoOrigen} ${ venta.nombreAlmacenOrigen ?? '' } ${venta.nombreClienteDestino ?? ''}`;
      this.lblVentaDestino = `${venta.cliente ?? ''}`;
      this.lblVentaFecha = venta.fechaVenta;
      this.lblVentaHora = venta.horaVenta;

      this.lblVentaClienteOTP = venta.nombreClienteOtp;
      this.lblVentaOTP = venta.otpGenerado;
      this.lblVentaCelular = venta.celular;
      this.lblVentaFechaOTP = `${venta.fechaRecibidoOtp} - ${venta.horaRecibidoOtp}`;
      
      if(this.firmado == "0"){
        this.btnVentaEnviarDocumento = "Enviar PDF y OTP"
      } 

      if(this.firmado == "1"){
        this.btnVentaEnviarDocumento = "Enviar PDF"
      }
      console.log(data);
    });
  }

  listaVentaByOrigen() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idAlmacenOrigen: this.idAlmacenOrigen,
      idClienteOrigen: this.idClienteOrigen,
      estado: '1',
    };
    this.ventaHttpService
      .listaVentaByOrigen(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaVentas = data.ventas;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(environment.dtOptions);
        });
      });
  }

  documentoPdfVentaById() {
      let parametros = {
        idLogin: localStorage.getItem('idLogin'),
        idVenta: this.idVenta,
        estado: '1',
      };
      this.ventaHttpService
        .documentoPdfVentaById(parametros)
        .subscribe((res) => {
          if (this.alertaSwalService.mostrarErrorHttp(res)) {
            return;
          }
  
          const body = res.body;
          let data = body.data;
          console.log(data)
  
          const base64 = data["documentoBase64"];
          const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = data["documentoNombre"];
          link.click();
          URL.revokeObjectURL(url);
        });
    }
  
    enviarDocumentoYOtpVentaById() {
      Swal.fire({
        title: 'Enviando . . .',
        html: 'Aguarde unos segundos estamos enviando los mensajes',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      let parametros = {
        idLogin: localStorage.getItem('idLogin'),
        idVenta: this.idVenta,
        idCliente: this.idCliente,
        estado: '1',
      };
      this.clienteHttpService.enviarDocumentoYOtpVentaById(parametros).subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }
  
        const body = res.body;
        let data = body.data;
        Swal.close();
        this.toastr.success('WhatsApp enviado correctamente')
        console.log(data);
      });
    }
}
