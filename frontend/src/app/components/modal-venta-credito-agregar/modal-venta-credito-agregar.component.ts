import { AfterViewInit, Component, Input, Output, EventEmitter, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { AlmacenHttpService } from '../../client/almacen-http.service';
import { ClienteHttpService } from '../../client/cliente-http.service';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { VentaHttpService } from '../../client/venta-http.service';
import { PrecioVentaHttpService } from '../../client/precioventa-http.service';
import { ProductoHttpService } from '../../client/producto-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

declare var $:any;

@Component({
  selector: 'app-modal-venta-credito-agregar',
  templateUrl: './modal-venta-credito-agregar.component.html',
  styleUrls: ['./modal-venta-credito-agregar.component.css']
})
export class ModalVentaCreditoAgregarComponent implements OnInit, AfterViewInit, OnDestroy{
  @Output() eventOutput_pagoConfirmado = new EventEmitter<any>();

  idVenta:any = "";
  txtCreditoMonto:any = "";
  cboxCuenta:any = "";

  listaCuentas: any = [];

  constructor(
    private paramGet: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private almacenHttpService: AlmacenHttpService,
    private clienteHttpService: ClienteHttpService,
    private cuentaHttpService: CuentaHttpService,
    private ventaHttpService: VentaHttpService,
    private productoHttpService: ProductoHttpService,
    private precioVentaHttpService: PrecioVentaHttpService,
  ) {}

  @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
      if ($('#modalPagoCredito').hasClass('show')) {
        $('#modalPagoCredito').modal('hide');
      }
    }
    
  ngOnInit(): void {
    $('#modalPagoCredito').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  eventInput_abrirModal(element: any) {
    this.idVenta = element.idVenta;
    this.listaCuentas = [];
    
    this.listaCuentaByEstado();
    $('#modalPagoCredito').modal('show');

    this.cboxCuenta = "";
  }

  click_agregarPago(){
    this.agregarCreditoVenta();
  }

  

  agregarCreditoVenta(){
    if (this.txtCreditoMonto.length == "") {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Por favor, Ingrese el monto de pago, o puede ingresar 0.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (this.cboxCuenta == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona una cuenta.', confirmButtonText: 'Ok' });
      return;
    }
    

    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idVenta": this.idVenta,
      "idCuenta": this.cboxCuenta,
      "monto": this.txtCreditoMonto,
      "fechaCredito": '2000-01-01',
      "pagado": '1'
    };

    this.ventaHttpService.agregarVentaCredito(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data

      this.txtCreditoMonto = "";
      this.cboxCuenta = "";
      $('#modalPagoCredito').modal('hide');
      this.toastr.success('Pago realizado correctamente')

      let dataOutput = {}
      this.eventOutput_pagoConfirmado.emit(dataOutput);
    });
  }

  listaCuentaByEstado(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "estado": "1",
    };
    this.cuentaHttpService.listaCuentaByEstado(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaCuentas = data;

    });
  }
}
