import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { AlmacenHttpService } from '../../client/almacen-http.service';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { CompraHttpService } from '../../client/compra-http.service';
import { ProductoHttpService } from '../../client/producto-http.service';
import { PrecioVentaHttpService } from '../../client/precioventa-http.service';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-compra-nueva',
  templateUrl: './compra-nueva.component.html',
  styleUrls: ['./compra-nueva.component.css']
})
export class CompraNuevaComponent implements OnInit, AfterViewInit, OnDestroy{

  idProducto:any = "";

  cboxAlmacen:any = "";
  cboxCuenta:any = "";
  cboxProducto:any = "";
  txtFecVen:any = "";
  txtCantidad:any = "";
  txtCosto:any = "";
  txtPrecioVenta:any = "";
  txtDetalle:any = "";

  total:any = 0.00;
  descuento:any = 0.00
  costoTotal:any = 0.00

  lblTotal:any = 0.00;

  listaAlmacen: any = [];
  listaCuentas: any = [];
  listaProductos: any = [];
  listaCarrito: any = [];
  listaHistorialProductos: any = [];
  listaPrecioVenta: any = [];

  constructor(
    private toastr: ToastrService,
    private location: Location,
    private router: Router,
    private alertaSwalService: AlertaSwalService,
    private almacenHttpService: AlmacenHttpService,
    private cuentaHttpService: CuentaHttpService,
    private compraHttpService: CompraHttpService,
    private productoHttpService: ProductoHttpService,
    private precioVentaHttpService: PrecioVentaHttpService
  ) {}

  @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
      // Si el modal está abierto
      if ($('#modalHistorialProducto').hasClass('show')) {
        $('#modalHistorialProducto').modal('hide');
      }
      if ($('#modalPrecioVenta').hasClass('show')) {
        $('#modalPrecioVenta').modal('hide');
      }
    }
  
    ngOnInit(): void {
      $('#modalHistorialProducto').on('shown.bs.modal', () => {
        history.pushState(null, '', window.location.href);
      });
      $('#modalPrecioVenta').on('shown.bs.modal', () => {
        history.pushState(null, '', window.location.href);
      });
  }

  ngAfterViewInit(): void {
    this.listaAlmacenByEstado();
    this.listaCuentaByEstado();
    this.listaProductoByEstado();
  }

  ngOnDestroy(): void {

  }

  click_agregarProducto(){
    if (this.cboxProducto == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona un producto.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtCantidad == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa la cantidad de compra.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtCosto == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el costo unitario de compra.', confirmButtonText: 'Ok' });
      return;
    }

    let subTotal = parseInt(this.txtCantidad) * parseFloat(this.txtCosto)
    this.listaCarrito.push({
      "idProducto": this.cboxProducto.idProducto,
      "codigoLiteral": this.cboxProducto.codigoLiteral,
      "nombre": this.cboxProducto.nombre,
      "fechaVencimiento": this.txtFecVen,
      "cantidad": this.txtCantidad,
      "costo": parseFloat(this.txtCosto).toFixed(2),
      "subTotal": subTotal.toFixed(2),
    })

    this.cboxProducto = ""
    this.txtFecVen = ""
    this.txtCantidad = ""
    this.txtCosto = ""

    this.calculaTotal();
  }

  click_historialProducto(){
    this.idProducto = this.cboxProducto.idProducto;
    if (this.cboxProducto == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: '"Por favor, selecciona un producto para buscar el historial.', confirmButtonText: 'Ok' });
      return;
    }

    this.listaCompraProductoHistorialByProducto();

    $('#modalHistorialProducto').modal('show');
  }

  click_precioVenta(){
    if (this.cboxProducto == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: '"Por favor, selecciona un producto para buscar el historial.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtCosto == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: '"Por favor, ingresa el costo de adquisición del producto.', confirmButtonText: 'Ok' });
      return;
    }

    this.listaPrecioVentaByCostoEstado();

    $('#modalPrecioVenta').modal('show');
  }

  click_eliminarProducto(element:any){
    const index = this.listaCarrito.indexOf(element);
    if (index > -1) {
      this.listaCarrito.splice(index, 1);
    }
    this.calculaTotal();
  }

  calculaTotal(){
    this.total = 0.00;
    for(let i=0; i<this.listaCarrito.length; i++){
      this.total = parseFloat(this.total) + parseFloat(this.listaCarrito[i]["subTotal"]);
    }
    this.costoTotal = parseFloat(this.total) - parseFloat(this.descuento)
    this.lblTotal = this.costoTotal.toFixed(2);
  }

  agregarCompra(){
    if (this.cboxAlmacen == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: '"Por favor, selecciona un almacén para almacenar el producto.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.cboxCuenta == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona una cuenta para debitar.', confirmButtonText: 'Ok' });
      return;
    }

    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idCuenta": this.cboxCuenta,
      "idAlmacen": this.cboxAlmacen,
      "productos": this.listaCarrito,
      "total": this.total,
      "descuento": this.descuento,
      "costoTotal": this.costoTotal,
      "observacion": this.txtDetalle,
      "credito": '0'
    };

    this.compraHttpService.agregarCompra(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data

      this.toastr.success('Compra realizado correctamente')
      this.router.navigate(['/compra'], { replaceUrl: true });
    });
  }

  listaCompraProductoHistorialByProducto(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idProducto": this.idProducto,
      "estado": "1",
    };
    this.compraHttpService.listaCompraProductoHistorialByProducto(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaHistorialProductos = data.detalles;
    });
  }

  listaPrecioVentaByCostoEstado(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "costo": this.txtCosto,
      "estado": "1",
    };
    this.precioVentaHttpService.listaPrecioVentaByCostoEstado(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaPrecioVenta = data;
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
