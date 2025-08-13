import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { ClienteHttpService } from '../../client/cliente-http.service';
import { TraspasoHttpService } from '../../client/traspaso-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-traspaso-lista',
  templateUrl: './traspaso-lista.component.html',
  styleUrls: ['./traspaso-lista.component.css'],
})
export class TraspasoListaComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  tipoAlmacenOrigen: any = '';

  idTraspaso = '';
  idAlmacenOrigen: any = '';
  idClienteOrigen: any = '';
  idClienteDestino: any = '';
  idAlmacenDestino: any =  '';
  firmado:any = "";

  btnTraspasoEnviarDocumento: any = '';
  lblTraspasoTipo: any = '';
  lblTraspasoOrigen: any = '';
  lblTraspasoDestino: any = '';
  lblTraspasoFecha: any = '';
  lblTraspasoHora: any = '';
  lblUsuario: any = '';

  lblTraspasoClienteOTP: any = '';
  lblTraspasoOTP: any = '';
  lblTraspasoCelular: any = '';
  lblTraspasoFechaOTP: any = '';

  lblTotalPuntos: any = '';
  lblTotalCantidad: any = '';
  lblTotalPrecio: any = '';

  listaTraspasos: any = [];
  listaTraspasoDetalle: any = [];

  constructor(
    private paramGet: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private alertaSwalService: AlertaSwalService,
    private traspasoHttpService: TraspasoHttpService,
    private clienteHttpService: ClienteHttpService
  ) {}

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalTraspasoDetalle').hasClass('show')) {
      $('#modalTraspasoDetalle').modal('hide');
    }
  }
  
    ngOnInit(): void {
      $('#modalTraspasoDetalle').on('shown.bs.modal', () => {
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

      console.log(
        'ENTRO',
        this.tipoAlmacenOrigen,
        this.idAlmacenOrigen,
        this.idClienteOrigen
      );
      setTimeout(() => {
        this.listaTraspasoByOrigen();
      }, 200);
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(environment.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  click_enviarDocumentoYOtp(){
    this.enviarDocumentoYOtpTraspasoById();
  }

  click_generarDocumentoPdf(){
    this.documentoPdfTraspasoById();
  }

  click_traspasoDetalle(element: any) {
    this.idTraspaso = element.idTraspaso;
    //this.enviarDocumentoYOtp();
    this.traspasoById();
    $('#modalTraspasoDetalle').modal('show');
  }

  listaTraspasoByOrigen() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idAlmacenOrigen: this.idAlmacenOrigen,
      idClienteOrigen: this.idClienteOrigen,
      estado: '1',
    };
    this.traspasoHttpService
      .listaTraspasoByOrigen(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaTraspasos = data.traspasos;

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(environment.dtOptions);
        });
      });
  }

  traspasoById() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
      idTraspaso: this.idTraspaso,
    };
    this.traspasoHttpService.traspasoById(parametros).subscribe((res) => {
      if (this.alertaSwalService.mostrarErrorHttp(res)) {
        return;
      }

      const body = res.body;
      let data = body.data;
      let traspaso = data.traspaso;
      this.listaTraspasoDetalle = data.detalle;
      this.lblTotalPuntos = data.totalPuntos;
      this.lblTotalCantidad = data.totalCantidad;
      this.lblTotalPrecio = data.totalPrecioFormato;

      this.idAlmacenDestino = traspaso.idAlmacenDestino;
      this.idClienteDestino = traspaso.idClienteDestino;
      this.firmado = traspaso.firmado;
      this.lblTraspasoTipo = `${traspaso.tipoOrigen} - ${traspaso.tipoDestino}`;
      this.lblTraspasoOrigen = `${traspaso.tipoOrigen} ${ traspaso.nombreAlmacenOrigen ?? '' } ${traspaso.nombreClienteDestino ?? ''}`;
      this.lblTraspasoDestino = `${traspaso.tipoDestino} ${ traspaso.nombreAlmacenDestino ?? '' } ${traspaso.nombreClienteDestino ?? ''}`;
      this.lblTraspasoFecha = traspaso.fechaTraspaso;
      this.lblTraspasoHora = traspaso.horaTraspaso;
      this.lblUsuario = traspaso.usuario;

      this.lblTraspasoClienteOTP = traspaso.nombreClienteOtp;
      this.lblTraspasoOTP = traspaso.otpGenerado;
      this.lblTraspasoCelular = traspaso.celular;
      this.lblTraspasoFechaOTP = `${traspaso.fechaRecibidoOtp} - ${traspaso.horaRecibidoOtp}`;
      
      if(this.firmado == "0"){
        this.btnTraspasoEnviarDocumento = "Enviar PDF y OTP"
      } 

      if(this.firmado == "1"){
        this.btnTraspasoEnviarDocumento = "Enviar PDF"
      }
      console.log(data);
    });
  }

  documentoPdfTraspasoById() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idTraspaso: this.idTraspaso,
      estado: '1',
    };
    this.traspasoHttpService
      .documentoPdfTraspasoById(parametros)
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

  enviarDocumentoYOtpTraspasoById() {
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
      idTraspaso: this.idTraspaso,
      idCliente: this.idClienteDestino,
      estado: '1',
    };
    this.clienteHttpService.enviarDocumentoYOtpTraspasoById(parametros).subscribe((res) => {
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
