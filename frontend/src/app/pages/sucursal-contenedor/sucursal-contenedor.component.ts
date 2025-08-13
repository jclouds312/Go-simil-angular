import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { SucursalHttpService } from '../../client/sucursal-http.service';
import { AlmacenHttpService } from '../../client/almacen-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-sucursal-contenedor',
  templateUrl: './sucursal-contenedor.component.html',
  styleUrls: ['./sucursal-contenedor.component.css'],
})
export class SucursalContenedorComponent implements OnInit, AfterViewInit, OnDestroy{

  idRol:any = "";
  idSucursal:any = "";
  idSucursalAlmacen:any = "";
  lblNombreSucursal = '';

  cboxAlmacen:any = "";

  listaAlmacen:any = [];
  listaSucursalAlmacen:any = [];

  constructor(
    private paramGet: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private sucursalHttpService: SucursalHttpService,
    private almacenHttpService: AlmacenHttpService
  ) {}

  ngOnInit(): void {
    this.idRol = localStorage.getItem("idRol")
    this.paramGet.params.subscribe((params) => {
      this.idSucursal = params['idSucursal'];
    });
  }

  ngAfterViewInit(): void {
    this.sucursalById()
  }

  ngOnDestroy(): void {}

  click_venta(){
    this.router
      .navigate(['venta'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_producto(){
    this.router
      .navigate(['venta/producto'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_usuario(){
    this.router
      .navigate(['venta/usuario'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_listaVenta(){
this.router
      .navigate(['venta/lista', 'sucursal'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_listaCuentas(){
    this.router
      .navigate(['cuenta'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_asignarAlmacen(){
    this.listaAlmacenBySucursal();
    this.listaAlmacenByEstado();

    $('#modalSucursalAlmacen').modal('show');
  }

  click_comision(){
    this.router
      .navigate(['comision'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_eliminarAlmacen(element:any){
    this.idSucursalAlmacen = element.idSucursalAlmacen;

    Swal.fire({
      title: '¿Deshabilitar Almacén?',
      text: "Estas a punto de deshabilitar el almacén "+ element["nombreAlmacen"],
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c82333',
      cancelButtonColor: '#6e7881',
      cancelButtonText: "Cancelar",
      confirmButtonText: 'Deshabilitar!',
    }).then((result) => {
      if (result.isConfirmed) {
        let parametros = {
          "idLogin": localStorage.getItem("idLogin"),
          "idSucursalAlmacen": this.idSucursalAlmacen,
          "estado": '0'
        };
        this.sucursalHttpService.actualizarAlmacenEstadoById(parametros).subscribe(res => {
          if (this.alertaSwalService.mostrarErrorHttp(res)){
            return
          }
    
          const body = res.body;
          let data = body.data

          this.cboxAlmacen = "";
          this.listaAlmacenBySucursal();
          this.toastr.success('Almacén deshabilitado correctamente')
        });
      }
    })
  }

  agregarSucursalAlmacen(){
    if (this.cboxAlmacen == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Seleccione un Almacén para asignar a la sucursal', confirmButtonText: 'Ok' });
      return;
    }

    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idAlmacen": this.cboxAlmacen.idAlmacen,
      "idSucursal": this.idSucursal,
    };
    this.sucursalHttpService.agregarSucursalAlmacen(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data

      this.cboxAlmacen = "";
      this.listaAlmacenBySucursal();
      this.toastr.success('Almacén asignado correctamente')
      
    });
  }

  sucursalById(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idSucursal": this.idSucursal,
    };
    this.sucursalHttpService.sucursalById(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.lblNombreSucursal = data['nombreSucursal'];
    });
  }

  listaAlmacenByEstado(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "estado": "1",
    };
    this.almacenHttpService.listaAlmacenByEstado(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaAlmacen = data;
    });
  }

  listaAlmacenBySucursal(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idSucursal": this.idSucursal,
      "estado": "1"
    };
    this.sucursalHttpService.listaAlmacenBySucursal(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaSucursalAlmacen = data;
    });
  }

}
