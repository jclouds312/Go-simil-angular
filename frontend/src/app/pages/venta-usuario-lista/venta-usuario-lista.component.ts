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
import { ModalVentaCreditoAgregarComponent } from 'src/app/components/modal-venta-credito-agregar/modal-venta-credito-agregar.component';
declare var $:any;

@Component({
  selector: 'app-venta-usuario-lista',
  templateUrl: './venta-usuario-lista.component.html',
  styleUrls: ['./venta-usuario-lista.component.css']
})
export class VentaUsuarioListaComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(ModalVentaCreditoAgregarComponent) modalPagoCredito!: ModalVentaCreditoAgregarComponent;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  tipoAlmacenOrigen: any = '';

  idSucursal:any = '';
  idVenta = '';
  idVentaDetalle = '';
  idAlmacenOrigen: any = '';
  idClienteOrigen: any = '';
  idCliente: any = '';

  fechaInicio:any = '';
  fechaFin:any = '';

  firmado:any = "";
  pagado:any = "";

  btnVentaEnviarDocumento: any = '';
  lblVentaTipo: any = '';
  lblVentaOrigen: any = '';
  lblVentaDestino: any = '';
  lblVentaFecha: any = '';
  lblVentaHora: any = '';
  lblUsuario:any = "";

  lblVentaClienteOTP: any = '';
  lblVentaOTP: any = '';
  lblVentaCelular: any = '';
  lblVentaFechaOTP: any = '';

  lblTotalPuntos: any = '';
  lblTotalCantidad: any = '';
  lblTotalPrecio: any = '';
  lblTotalSaldo: any = '';
  lblTotalCredito: any = '';

  txtDevolucionCantidad:any = "0";
  lblDevolucionProducto:any = "";
  lblDevolucionCantidad:any = "";
  lblDevolucionPrecio:any = "";
  lblDevolucionSubTotal:any = "";

  listaVentas: any = [];
  listaVentaDetalle: any = [];
  listaPagos: any = [];

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
    if ($('#modalDevolucionProducto').hasClass('show')) {
      $('#modalDevolucionProducto').modal('hide');
    }
  }
  
  ngOnInit(): void {
    $('#modalVentaDetalle').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    $('#modalDevolucionProducto').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    this.paramGet.paramMap.subscribe((params) => {
      this.idSucursal = this.paramGet.parent?.snapshot.paramMap.get('idSucursal');
    });

    console.log(this.tipoAlmacenOrigen, this.idCliente, this.idSucursal, this.idAlmacenOrigen)
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(environment.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  eventOutput_buscar(element:any){
    this.fechaInicio = element.fechaInicio;
    this.fechaFin = element.fechaFin;

    this.listaVentaUsuarioBySucursalFechas();
  }

  eventOutput_pagoConfirmado(element:any){
    this.ventaById()
    setTimeout(() => {
      $('#modalVentaDetalle').modal('show');
    }, 300);
  }

  click_eventInput_abrirModal() {
    $('#modalVentaDetalle').modal('hide');
    let data = {
      idVenta: this.idVenta
    }
    this.modalPagoCredito.eventInput_abrirModal(data);
  }

  click_agregarVenta() {
    this.router.navigate(['venta/nuevo']).then(() => {
      //window.location.reload();
    });
  }

  click_ventaDetalle(element: any) {
    this.idVenta = element.idVenta;
    this.ventaById();
    $('#modalVentaDetalle').modal('show');
  }

  click_cantidadDevolucionProducto(element:any){
    this.idVentaDetalle = element.idVentaDetalle;
    this.lblDevolucionProducto = element.nombre
    this.lblDevolucionCantidad = element.cantidad
    this.lblDevolucionPrecio = element.ventaFormato
    this.lblDevolucionSubTotal = element.subTotalFormato


    this.txtDevolucionCantidad = "";
    $('#modalVentaDetalle').modal('hide');
    $('#modalDevolucionProducto').modal('show');
  }

  click_devolucionProducto(){
    Swal.fire({
      title: '¿Devolver Producto?',
      text: `Estas a punto de devolver el producto`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c82333',
      cancelButtonColor: '#6e7881',
      cancelButtonText: "Cancelar",
      confirmButtonText: 'Devolver!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.agregarDevolucionVentaDetalleById()
      }
    })  
    
  }

  click_enviarDocumentoYOtp(){
    this.enviarDocumentoYOtpVentaById();
  }

  click_generarDocumentoPdf(){
    this.documentoPdfVentaById();
  }

  agregarDevolucionVentaDetalleById() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idVentaDetalle: this.idVentaDetalle,
      cantidad: this.txtDevolucionCantidad,
      estado: '1',
    };
    this.ventaHttpService
      .agregarDevolucionVentaDetalleById(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;

        this.ventaById();
        this.toastr.success('Devolución realizado correctamente');
        $('#modalDevolucionProducto').modal('hide');
        $('#modalVentaDetalle').modal('show');
      });
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
      this.listaPagos = data.credito;
      this.lblTotalPuntos = data.totalPuntos;
      this.lblTotalCantidad = data.totalCantidad;
      this.lblTotalPrecio = data.totalPrecioFormato;
      this.lblTotalSaldo = data.totalSaldoFormato;
      this.lblTotalCredito = data.totalCreditoFormato;

      this.idCliente = venta.idCliente;
      this.firmado = venta.firmado;
      this.pagado = venta.pagado;
      this.lblVentaTipo = `${venta.tipoOrigen} - ${venta.tipoDestino}`;
      this.lblVentaOrigen = `${venta.tipoOrigen} ${ venta.nombreAlmacenOrigen ?? '' } ${venta.nombreClienteDestino ?? ''}`;
      this.lblVentaDestino = `${venta.cliente ?? ''}`;
      this.lblVentaFecha = venta.fechaVenta;
      this.lblVentaHora = venta.horaVenta;
      this.lblUsuario = venta.usuario;

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

    });
  }

  listaVentaByEstado() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
    };
    this.ventaHttpService
      .listaVentaByEstado(parametros)
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

  listaVentaByOrigen() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
      idAlmacenOrigen: this.idAlmacenOrigen
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

  listaVentaByCliente() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idCliente: this.idCliente,
      estado: '1',
    };
    this.ventaHttpService
      .listaVentaByCliente(parametros)
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

  listaVentaUsuarioBySucursalFechas() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idSucursal: this.idSucursal,
      fechaFin: this.fechaFin,
      fechaInicio: this.fechaInicio,
      estado: '1',
    };
    this.ventaHttpService
      .listaVentaUsuarioBySucursalFechas(parametros)
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
