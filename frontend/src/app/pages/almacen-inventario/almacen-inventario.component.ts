import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { AlmacenHttpService } from '../../client/almacen-http.service';
import { ProductoHttpService } from '../../client/producto-http.service';
import { environment } from 'src/environments/environment';
declare var $:any;

@Component({
  selector: 'app-almacen-inventario',
  templateUrl: './almacen-inventario.component.html',
  styleUrls: ['./almacen-inventario.component.css'],
})
export class AlmacenInventarioComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('seccionInventarioDetalle') seccionInventarioDetalle!: ElementRef;

  idAlmacen:any = "";
  idCliente:any = "";
  idProducto:any = "";
  idInventario:any = "";

  tipoAlmacen:any = "";

  lblProductoNombre:any = "";
  lblProductoDescripcion:any = "";
  lblProductoCodigo:any = "";
  lblProductoPrecio:any = "";
  lblProductoPuntos:any = "";

  lblTotalCantidad:any = "";
  lblTotalPuntos:any = "";
  lblTotalCosto:any = "";

  lblTotalAlmacenCantidad:any = "";
  lblTotalAlmacenCosto:any = "";
  lblTotalAlmacenPuntos:any = "";

  listaProductos: any = [];
  listaHistorial: any = [];
  listaProductosInventario: any = [];

  constructor(
    private paramGet: ActivatedRoute,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private almacenHttpService: AlmacenHttpService,
    private productoHttpService: ProductoHttpService
  ) {}

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalProductoInventario').hasClass('show')) {
      $('#modalProductoInventario').modal('hide');
    }
  }

  ngOnInit(): void {
    $('#modalProductoInventario').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    this.paramGet.parent?.paramMap.subscribe((params) => {
      this.idAlmacen = params.get('idAlmacen');
      this.idCliente = params.get('idCliente');

      if (this.idAlmacen != undefined) {
        this.tipoAlmacen = 'almacen';
        this.idCliente = "1";
      } else {
        if (this.idCliente != undefined) {
          this.tipoAlmacen = 'cliente';
          this.idAlmacen = '1';
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.listaInventarioProductoByAlmacen();
  }

  ngOnDestroy(): void {}

  click_verProductos(element:any){
    this.idProducto = element.idProducto;
    this.lblProductoCodigo = element.codigoLiteral;
    this.lblProductoNombre = element.nombreProducto;
    this.lblProductoDescripcion = element.descripcionProducto;
    this.lblProductoPrecio = element.precioFormato;
    this.lblProductoPuntos = element.puntosProducto;
    this.listaInventarioProductoByAlmacenProducto();

    this.seccionInventarioDetalle.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  click_verHistorial(element:any){
    this.idInventario = element.idInventarioProducto;
    this.listaInventarioHistorialByInventario();

    $('#modalProductoInventario').modal('show');
  }

  click_verHistorialTodo(){
    this.listaInventarioHistorialByAlmacenProducto();

    $('#modalProductoInventario').modal('show');
  }

  listaInventarioProductoByAlmacen() {
    let parametros = {
      "idLogin": localStorage.getItem('idLogin'),
      "tipoAlmacen": this.tipoAlmacen,
      "idAlmacen": this.idAlmacen,
      "idCliente": this.idCliente,
      "estado": '1',
    };
    this.productoHttpService
      .listaInventarioProductoByAlmacen(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaProductos = data["productos"];
        this.lblTotalAlmacenCantidad = data["totalCantidad"];
        this.lblTotalAlmacenCosto = data["totalCosto"];
        this.lblTotalAlmacenPuntos = data["totalPuntos"];
      });
  }

  listaInventarioProductoByAlmacenProducto() {
    let parametros = {
      "idLogin": localStorage.getItem('idLogin'),
      "tipoAlmacen": this.tipoAlmacen,
      "idAlmacen": this.idAlmacen,
      "idCliente": this.idCliente,
      "idProducto": this.idProducto,
      "cantidad": "-1",
      "estado": '1',
    };
    this.productoHttpService
      .listaInventarioProductoByAlmacenProducto(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaProductosInventario = data["productos"];
        this.lblTotalCantidad = data["totalCantidad"];
        this.lblTotalCosto = data["totalCostoFormato"];
        this.lblTotalPuntos = data["totalPuntos"];
      });
  }

  listaInventarioHistorialByAlmacenProducto() {
    let parametros = {
      "idLogin": localStorage.getItem('idLogin'),
      "tipoAlmacen": this.tipoAlmacen,
      "idAlmacen": this.idAlmacen,
      "idCliente": this.idCliente,
      "idProducto": this.idProducto,
      "estado": '1',
    };
    this.productoHttpService
      .listaInventarioHistorialByAlmacenProducto(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaHistorial = data;
      });
  }

  listaInventarioHistorialByInventario() {
    let parametros = {
      "idLogin": localStorage.getItem('idLogin'),
      "idInventario": this.idInventario,
      "estado": '1',
    };
    this.productoHttpService
      .listaInventarioHistorialByInventario(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.listaHistorial = data;
      });
  }
}
