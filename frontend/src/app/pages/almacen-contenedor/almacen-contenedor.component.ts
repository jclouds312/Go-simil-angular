import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { AlmacenHttpService } from '../../client/almacen-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-almacen-contenedor',
  templateUrl: './almacen-contenedor.component.html',
  styleUrls: ['./almacen-contenedor.component.css'],
})
export class AlmacenContenedorComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  idAlmacen: any = '';

  lblNombreAlmacen:any = "";

  txtNombreEditar: any = '';

  constructor(
    private paramGet: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private almacenHttpService: AlmacenHttpService
  ) {}

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalAlmacenEditar').hasClass('show')) {
      $('#modalAlmacenEditar').modal('hide');
    }
  }

  ngOnInit(): void {
    $('#modalAlmacenEditar').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });

    this.paramGet.params.subscribe((params) => {
      this.idAlmacen = params['idAlmacen'];
    });
  }

  ngAfterViewInit(): void {
    this.almacenById()
  }

  ngOnDestroy(): void {}

  click_editarAlmacen() {
    this.txtNombreEditar = this.lblNombreAlmacen;

    $('#modalAlmacenEditar').modal('show');
  }

  click_inventario() {
    this.router
      .navigate(['inventario'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_traspasoNuevo() {
    this.router
      .navigate(['salida', 'traspaso', 'almacen'], {
        relativeTo: this.paramGet,
      })
      .then(() => {
        //window.location.reload();
      });
  }

  click_listaTraspaso(){
    this.router
      .navigate(['traspaso', 'almacen'], {
        relativeTo: this.paramGet,
      })
      .then(() => {
        //window.location.reload();
      });
  }

  click_ventaNueva() {
    this.router
      .navigate(['salida', 'venta', 'almacen'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_listaVenta(){
    this.router
      .navigate(['venta', 'almacen'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_eliminarAlmacen() {
    Swal.fire({
      title: '¿Eliminar almacén?',
      text:
        'Estás por eliminar este almacén: ' + this.lblNombreAlmacen +' ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c82333',
      cancelButtonColor: '#6e7881',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        let parametros = {
          idLogin: localStorage.getItem('idLogin'),
          idAlmacen: this.idAlmacen,
          estado: '0',
        };
        this.almacenHttpService
          .actualizarEstadoById(parametros)
          .subscribe((res) => {
            if (this.alertaSwalService.mostrarErrorHttp(res)) {
              return;
            }

            const body = res.body;
            let data = body.data;

            this.toastr.success('Almacén eliminado correctamente');
          });
      }
    });
  }

  actualizarAlmacenById() {
    if (this.txtNombreEditar == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Por favor, ingresa el nombre del almacén.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idAlmacen: this.idAlmacen,
      nombre: this.txtNombreEditar,
      descripcion: '',
    };
    this.almacenHttpService
      .actualizarAlmacenById(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;

        $('#modalAlmacenEditar').modal('hide');
        this.toastr.success('Almacén actualizado correctamente');

        this.almacenById();
      });
  }

  almacenById(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idAlmacen": this.idAlmacen,
    };
    this.almacenHttpService.almacenById(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.lblNombreAlmacen = data['nombreAlmacen'];
    });
  }
}
