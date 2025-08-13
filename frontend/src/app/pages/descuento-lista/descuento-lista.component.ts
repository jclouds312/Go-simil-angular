import { AfterViewInit, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { DescuentoHttpService } from '../../client/descuento-http.service';
import { ProductoHttpService } from '../../client/producto-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-descuento-lista',
  templateUrl: './descuento-lista.component.html',
  styleUrls: ['./descuento-lista.component.css']
})
export class DescuentoListaComponent implements OnInit, AfterViewInit, OnDestroy{

  idDescuento:any = ""
  idProducto:any = "";
  txtNombre:any = "";
  txtPorcentaje:any = "";
  txtMultiplo:any = "";

  listaDescuento:any = []
  listaProductos:any = []

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private descuentoHttpService: DescuentoHttpService,
    private productoHttpService: ProductoHttpService,
  ) { }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalDescuentoAgregar').hasClass('show')) {
      $('#modalDescuentoAgregar').modal('hide');
    }
  }
  
    ngOnInit(): void {
      $('#modalDescuentoAgregar').on('shown.bs.modal', () => {
          history.pushState(null, '', window.location.href);
        });
    }

    ngAfterViewInit(): void {
      this.listaDescuentoByEstado()
    }
  
    ngOnDestroy(): void {

    }

    click_agregarDescuento(){
      this.idProducto = "";
      
      this.listaProductoByEstado();

      $('#modalDescuentoAgregar').modal('show');
    }

    click_actualizarEstadoById(element:any){
      this.idDescuento = element.idDescuento;

      Swal.fire({
          title: '¿Deshabilitar Descuento?',
          text: "Estas a punto de deshabilitar el descuento "+ element["nombre"],
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#c82333',
          cancelButtonColor: '#6e7881',
          cancelButtonText: "Cancelar",
          confirmButtonText: 'Deshabilitar!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.actualizarEstadoById();
          }
        })
        
    }

    

    

    agregarDescuento(){
      if (this.txtNombre == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el nombre del descuento.', confirmButtonText: 'Ok' });
        return;
      }

      if (this.idProducto == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, el producto para el descuento.', confirmButtonText: 'Ok' });
        return;
      }

      if (this.txtPorcentaje == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el porcentaje del descuento.', confirmButtonText: 'Ok' });
        return;
      }

      if (this.txtMultiplo == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el multiplo del descuento.', confirmButtonText: 'Ok' });
        return;
      }


      let parametros = {
        "idLogin": localStorage.getItem("idLogin"),
        "nombre": this.txtNombre,
        "porcentaje": this.txtPorcentaje,
        "idProducto": this.idProducto,
        "multiplo": this.txtMultiplo,
        "estado": "1"
      };
      this.descuentoHttpService.agregarDescuento(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        
        this.txtNombre = "";
        $('#modalDescuentoAgregar').modal('hide');
        this.toastr.success('Descuento creado correctamente')
        this.listaDescuentoByEstado()
      });
    }

    actualizarEstadoById(){
      let parametros = {
        idLogin: localStorage.getItem('idLogin'),
        estado: "0",
        idDescuento: this.idDescuento,
      };
      this.descuentoHttpService.actualizarEstadoById(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data

        this.toastr.success('Descuento deshabilitado correctamente');
        this.listaDescuentoByEstado()
      });
    }

    listaDescuentoByEstado(){
      let parametros = {
        "idLogin": localStorage.getItem("idLogin"),
        "estado": "1",
      };
      this.descuentoHttpService.listaDescuentoByEstado(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        this.listaDescuento = data;
      });
    }

    listaProductoByEstado() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
    };
    this.productoHttpService
      .listaProductoByEstado(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaProductos = data;
      });
  }
}
