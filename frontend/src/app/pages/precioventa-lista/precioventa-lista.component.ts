import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener  } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { PrecioVentaHttpService } from '../../client/precioventa-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;


@Component({
  selector: 'app-precioventa-lista',
  templateUrl: './precioventa-lista.component.html',
  styleUrls: ['./precioventa-lista.component.css']
})
export class PrecioventaListaComponent implements OnInit, AfterViewInit, OnDestroy{

  idPrecioVenta:any = "";
  txtPorcentaje:any = "";
  txtNombre:any = "";

  listaPrecios:any = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private precioVentaHttpService: PrecioVentaHttpService,
  ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalPrecioVentaAgregar').hasClass('show')) {
      $('#modalPrecioVentaAgregar').modal('hide');
    }
  }
  
  ngOnInit(): void {
    $('#modalPrecioVentaAgregar').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });

    this.listaPrecioVentaByEstado();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }
  click_agregarPrecioVenta(){
    $('#modalPrecioVentaAgregar').modal('show');
  }

  click_eliminarPrecioVenta(element:any){
    this.idPrecioVenta = element.idPrecioVenta;

    Swal.fire({
      title: '¿Eliminar Precio de Venta?',
      text:
        'Estás por eliminar el precio de venta: ' +
        element.nombre +
        ' ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c82333',
      cancelButtonColor: '#6e7881',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarEstadoById();
      }
    });
  }

  agregarPrecioVenta(){
    if (this.txtNombre == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el nombre del precio de venta.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtPorcentaje == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el porcentaje de venta.', confirmButtonText: 'Ok' });
      return;
    }

    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "nombre": this.txtNombre,
      "porcentaje": this.txtPorcentaje,
      "estado": "1",
    };
    this.precioVentaHttpService.agregarPrecioVenta(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      
      this.txtNombre = "";
      this.txtPorcentaje = "";
      $('#modalPrecioVentaAgregar').modal('hide');
      this.toastr.success('Precio de Venta creada correctamente')
      this.listaPrecioVentaByEstado()
    });
  }

  actualizarEstadoById(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idPrecioVenta": this.idPrecioVenta,
      "estado": "0",
    };
    this.precioVentaHttpService.actualizarEstadoById(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data

      this.toastr.success('Precio de Venta eliminado correctamente')
      this.listaPrecioVentaByEstado()
    });
  }

  listaPrecioVentaByEstado(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "estado": "1",
    };
    this.precioVentaHttpService.listaPrecioVentaByEstado(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaPrecios = data;

    });
  }
}
