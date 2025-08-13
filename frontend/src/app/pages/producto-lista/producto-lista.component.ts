import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { CategoriaHttpService } from '../../client/categoria-http.service';
import { ProductoHttpService } from '../../client/producto-http.service';
import { VentaHttpService } from '../../client/venta-http.service';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-producto-lista',
  templateUrl: './producto-lista.component.html',
  styleUrls: ['./producto-lista.component.css'],
})
export class ProductoListaComponent implements OnInit, AfterViewInit, OnDestroy {

  idProducto: any = '';
  idCategoria: any = '';
  txtCodigo: any = '';
  txtNombre: any = '';
  txtDescripcion: any = '';
  txtPrecio: any = '0';
  txtPuntos: any = '0';

  txtEditarCodigo: any = '';
  txtEditarNombre: any = '';
  txtEditarDescripcion: any = '';
  txtEditarPrecio: any = '';
  txtEditarPuntos: any = '';

  listaCategoria:any = []
  listaProductos: any = [];
  listaProductosAlmacen: any = [];
  listaProductosCliente: any = [];

  constructor(
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private router: Router,
    private categoriaHttpService: CategoriaHttpService,
    private productoHttpService: ProductoHttpService,
    private ventaHttpService: VentaHttpService
  ) {}

  @HostListener('window:popstate', ['$event'])
      onPopState(event: any) {
        // Si el modal está abierto
        if ($('#modalProductoAgregar').hasClass('show')) {
          $('#modalProductoAgregar').modal('hide');
        }
        if ($('#modalProductoActualizarDatos').hasClass('show')) {
          $('#modalProductoActualizarDatos').modal('hide');
        }
        if ($('#modalProductoActualizarPrecio').hasClass('show')) {
          $('#modalProductoActualizarPrecio').modal('hide');
        }
        if ($('#modalProductoAlmacen').hasClass('show')) {
          $('#modalProductoAlmacen').modal('hide');
        }
      }
      
  ngOnInit(): void {
    $('#modalProductoAgregar').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    $('#modalProductoActualizarDatos').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    $('#modalProductoActualizarPrecio').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    $('#modalProductoAlmacen').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });

    if(localStorage.getItem("idRol") == "Vendedor Optica"){
      this.router.navigate(['/sucursal/lista']).then(() => {
        window.location.reload();
      });
    }

    if(localStorage.getItem("idRol") == "Vendedor Audiosim"){
      this.router.navigate(['/audiometria']).then(() => {
        window.location.reload();
      });
    }

    setTimeout(() => {
      this.listaCategoriaByEstado();
      this.listaProductoByEstado();
    }, 200);
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {

  }

  click_agregarProducto() {
    $('#modalProductoAgregar').modal('show');
  }

  click_actualizarDatos(element:any) {
    this.idProducto = element.idProducto;
    this.txtEditarCodigo = element.codigo;
    this.txtEditarNombre = element.nombre;
    this.txtEditarDescripcion = element.descripcion;
    this.idCategoria = element.idCategoria;
    this.txtEditarPrecio = element.precio;

    $('#modalProductoActualizarDatos').modal('show');
  }

  click_actualizarPrecioPuntos(element:any) {
    this.idProducto = element.idProducto;
    this.txtEditarPrecio = element.precio;
    this.txtEditarPuntos = element.puntos;

    $('#modalProductoActualizarPrecio').modal('show');
  }

  click_buscarProducto(element:any){
    this.idProducto = element.idProducto;

    this.listaInventarioProductoByProducto();
    this.listaVentaDetalleByIdProductoPagado();

    $('#modalProductoAlmacen').modal('show');
  }

  agregarProducto() {
    if (this.txtNombre == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Por favor, ingresa el nombre del producto.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (this.txtPrecio == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Por favor, ingresa el precio del producto.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (this.idCategoria == '') {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Por favor, ingresa el puntaje del producto.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    let parametros = {
      "idLogin": localStorage.getItem('idLogin'),
      "idCategoria": this.idCategoria,
      "codigo": this.txtCodigo,
      "nombre": this.txtNombre,
      "descripcion": this.txtDescripcion,
      "precio": this.txtPrecio,
      "puntos": this.txtPuntos
    };

    this.productoHttpService.agregarProducto(parametros).subscribe((res) => {
      if (this.alertaSwalService.mostrarErrorHttp(res)) {
        return;
      }

      const body = res.body;
      let data = body.data;

      this.idCategoria = '';
      this.txtCodigo = '';
      this.txtNombre = '';
      this.txtDescripcion = '';
      this.txtPrecio = '0';
      this.txtPuntos = '';
      $('#modalProductoAgregar').modal('hide');
      this.toastr.success('Producto creado correctamente');
      this.listaProductoByEstado();
    });
  }

  actualizarDatosProductodByid() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idProducto: this.idProducto,
      codigo: this.txtEditarCodigo,
      nombre: this.txtEditarNombre,
      descripcion: this.txtEditarDescripcion,
      idCategoria: this.idCategoria,
      precio: this.txtEditarPrecio,
      estado: '1',
    };
    this.productoHttpService
      .actualizarDatosProductodByid(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;

        $('#modalProductoActualizarDatos').modal('hide');
        this.toastr.success('Datos actualizados correctamente');
        this.listaProductoByEstado();
      });
  }

  actualizarPrecioPuntosdByid() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idProducto: this.idProducto,
      precio: this.txtEditarPrecio,
      puntos: this.txtEditarPuntos,
      estado: '1',
    };
    this.productoHttpService
      .actualizarPrecioPuntosdByid(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;

        $('#modalProductoActualizarPrecio').modal('hide');
        this.toastr.success('Precio y Puntos actualizados correctamente');
        this.listaProductoByEstado();
      });
  }

  listaCategoriaByEstado(){
      let parametros = {
        "idLogin": localStorage.getItem("idLogin"),
        "estado": "1",
      };
      this.categoriaHttpService.listaCategoriaByEstado(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        this.listaCategoria = data;
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

  listaInventarioProductoByProducto() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
      idProducto: this.idProducto,
      cantidad: 0,
    };
    this.productoHttpService
      .listaInventarioProductoByProducto(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaProductosAlmacen = data.productos;
      });
  }

  listaVentaDetalleByIdProductoPagado() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
      idProducto: this.idProducto,
      devolucion: 0,
      pagado: 0,
    };
    this.ventaHttpService
      .listaVentaDetalleByIdProductoPagado(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaProductosCliente = data;
      });
  }
}
