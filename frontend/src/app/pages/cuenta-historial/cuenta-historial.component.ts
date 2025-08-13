import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-cuenta-historial',
  templateUrl: './cuenta-historial.component.html',
  styleUrls: ['./cuenta-historial.component.css'],
})
export class CuentaHistorialComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  idCuentaAdicionar:any = '';
  idCuenta: any = '';
  fechaInicio:any = '';
  fechaFin:any = '';
  tipo: any = '';
  txtMonto: any = '';
  txtDescripcion: any = '';

  cboxCuenta: any = '';
  txtTransferirMonto: any = '';
  txtTransferirDescripcion: any = '';

  lblCuenta: any = '';
  lblTipo: any = '';

  lblTotalIngreso: any = 0.0;
  lblTotalEgreso: any = 0.0;
  lblTotalSaldo: any = 0.0;

  listaHistorial: any = [];
  listaCuentas: any = [];
  listaCuentaSeleccionadas: any = [];
  arrayIdCuentas: any = [];

  constructor(
    private paramGet: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private cuentaHttpService: CuentaHttpService
  ) {}

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalCuentaHistorialAgregar').hasClass('show')) {
      $('#modalCuentaHistorialAgregar').modal('hide');
    }
    if ($('#modalCuentaTransferir').hasClass('show')) {
      $('#modalCuentaTransferir').modal('hide');
    }
  }

  ngOnInit(): void {
    $('#modalCuentaHistorialAgregar').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    $('#modalCuentaTransferir').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });

    this.paramGet.params.subscribe((params) => {
      this.idCuenta = params['idCuenta'];
      this.arrayIdCuentas.push(this.idCuenta);
    });

    setTimeout(() => {
      //this.listaCuentaHistorialByIdCuenta();
      this.listaCuentaByEstado();
    }, 200);
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

    this.listaCuentaHistorialByInCuentas();
  }

  click_trasnferir(element:any) {
    this.idCuenta = element.idCuenta;
    $('#modalCuentaTransferir').modal('show');
  }

  click_agregarIngreso(element:any) {
    this.idCuenta = element.idCuenta;
    this.tipo = '1';
    this.lblTipo = 'Ingreso';
    $('#modalCuentaHistorialAgregar').modal('show');
  }

  click_agregarEgreso(element:any) {
    this.idCuenta = element.idCuenta;
    this.tipo = '0';
    this.lblTipo = 'Egreso';
    $('#modalCuentaHistorialAgregar').modal('show');
  }

  click_adiccionarCuenta(){
    if(this.idCuentaAdicionar == ""){
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Por favor, seleccione una cuenta',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (this.arrayIdCuentas.includes(this.idCuentaAdicionar)) {
      Swal.fire({
        icon: 'warning',
        title: 'Esta cuenta ya fue seleccionada',
        text: 'Por favor, seleccione otra cuenta',
        confirmButtonText: 'Ok',
      });
    } else {
      this.arrayIdCuentas.push(this.idCuentaAdicionar);
      this.idCuentaAdicionar = ""
      this.listaCuentaHistorialByInCuentas();
    }
  }

  click_eliminarCuenta(element:any){
    this.arrayIdCuentas = this.arrayIdCuentas.filter((id:any) => id !== element.idCuenta);
    this.listaCuentaHistorialByInCuentas();
  }

  agregarCuentaHistorial() {
    if (this.txtMonto == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Introduzca el monto, por favor.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (this.txtDescripcion == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Introduzca la descripción, por favor.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    Swal.fire({
      title: `¿Registrar Nuevo ${this.lblTipo}?`,
      text: `Estás a punto de registrar un ${this.lblTipo} de $${this.txtMonto}, ¿Deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c82333',
      cancelButtonColor: '#6e7881',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Registrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        let parametros = {
          idLogin: localStorage.getItem('idLogin'),
          idCuenta: this.idCuenta,
          tipo: this.tipo,
          monto: this.txtMonto,
          descripcion: this.txtDescripcion,
        };
        this.cuentaHttpService
          .agregarCuentaHistorial(parametros)
          .subscribe((res) => {
            if (this.alertaSwalService.mostrarErrorHttp(res)) {
              return;
            }

            const body = res.body;
            let data = body.data;

            this.txtMonto = '';
            this.txtDescripcion = '';
            $('#modalCuentaHistorialAgregar').modal('hide');
            this.toastr.success('Transacción correctamente');
            this.listaCuentaHistorialByIdCuenta();
          });
      }
    });
  }

  transferirSaldoCuentaByCuenta() {
    if (this.cboxCuenta == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Por favor, seleccione una cuenta destino.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (this.txtTransferirMonto == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Introduzca el monto, por favor.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (this.txtTransferirDescripcion == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Introduzca la descripción, por favor.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    Swal.fire({
      title: `¿Transferir a la cuenta?`,
      text: `Estás a punto de trasnferir $${this.txtMonto}, ¿Deseas continuar?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c82333',
      cancelButtonColor: '#6e7881',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Transferir!',
    }).then((result) => {
      if (result.isConfirmed) {
        let parametros = {
          idLogin: localStorage.getItem('idLogin'),
          idCuentaOrigen: this.idCuenta,
          idCuentaDestino: this.cboxCuenta,
          monto: this.txtTransferirMonto,
          descripcion: this.txtTransferirDescripcion,
        };
        this.cuentaHttpService
          .transferirSaldoCuentaByCuenta(parametros)
          .subscribe((res) => {
            if (this.alertaSwalService.mostrarErrorHttp(res)) {
              return;
            }

            const body = res.body;
            let data = body.data;

            this.txtMonto = '';
            this.txtDescripcion = '';
            $('#modalCuentaTransferir').modal('hide');
            this.toastr.success('Transferencia realizada correctamente');
            this.listaCuentaHistorialByIdCuenta();
          });
      }
    });
  }

  listaCuentaByEstado() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
    };
    this.cuentaHttpService.listaCuentaByEstado(parametros).subscribe((res) => {
      if (this.alertaSwalService.mostrarErrorHttp(res)) {
        return;
      }

      const body = res.body;
      let data = body.data;
      this.listaCuentas = data;
    });
  }

  listaCuentaHistorialByIdCuenta() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idCuenta: this.idCuenta,
      estado: '1',
    };
    this.cuentaHttpService
      .listaCuentaHistorialByIdCuenta(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaHistorial = data['historial'];
        this.lblCuenta = data['cuenta']['alias'];
        this.lblTotalIngreso = data['totalIngresoFormato'];
        this.lblTotalEgreso = data['totalEgresoFormato'];
        this.lblTotalSaldo = data['totalSaldoFormato'];

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(environment.dtOptions);
        });
      });
  }

  listaCuentaHistorialByInCuentas() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idCuentas: this.arrayIdCuentas,
      fechaFin: this.fechaFin,
      fechaInicio: this.fechaInicio,
      estado: '1',
    };
    this.cuentaHttpService
      .listaCuentaHistorialByInCuentas(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaHistorial = data['historial'];
        this.listaCuentaSeleccionadas = data['cuentas'];
        //this.lblCuenta = data['cuenta']['alias'];
        this.lblTotalIngreso = data['totalIngresoFormato'];
        this.lblTotalEgreso = data['totalEgresoFormato'];
        this.lblTotalSaldo = data['totalSaldoFormato'];

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(environment.dtOptions);
        });
      });
  }
}
