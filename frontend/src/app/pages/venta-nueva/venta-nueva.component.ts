import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { AlmacenHttpService } from '../../client/almacen-http.service';
import { ClienteHttpService } from '../../client/cliente-http.service';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { VentaHttpService } from '../../client/venta-http.service';
import { TraspasoHttpService } from '../../client/traspaso-http.service';
import { ProductoHttpService } from '../../client/producto-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-venta-nueva',
  templateUrl: './venta-nueva.component.html',
  styleUrls: ['./venta-nueva.component.css']
})
export class VentaNuevaComponent implements OnInit, AfterViewInit, OnDestroy{

  idAlmacenOrigen:any = "";
  idClienteOrigen:any = "";
  idAlmacenDestino:any = "";
  idClienteDestino:any = "";
  tipoSalida:any = "";
  tipoAlmacen:any = "almacen";
  tipoAlmacenOrigen:any = "almacen";
  
  idInventarioProducto:any = ""
  cboxCliente:any = "";
  cboxCuenta:any = "";
  cboxProducto:any = "";
  txtCantidad:any = "";
  txtPrecio:any = "";
  txtDetalle:any = "";

  cantMax:any = 0;
  total:any = 0.00;
  descuento:any = 0.00
  precioTotal:any = 0.00

  lblTipo:any = "";

  lblAlmacenOrigen:any = "";

  lblTotal:any = 0.00;
  
  listaAlmacen: any = [];
  listaClientes: any = [];
  listaCuentas: any = [];
  listaProductos: any = [];
  listaCarrito: any = [];
  listaProductosInventario: any = [];

  constructor(
    private paramGet: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private almacenHttpService: AlmacenHttpService,
    private clienteHttpService: ClienteHttpService,
    private cuentaHttpService: CuentaHttpService,
    private ventaHttpService: VentaHttpService,
    private traspasoHttpService: TraspasoHttpService,
    private productoHttpService: ProductoHttpService
  ) {}

  ngOnInit(): void { 
    this.paramGet.paramMap.subscribe((params) => {
      this.tipoSalida = params.get('tipo');            // ej: traspaso
      this.tipoAlmacenOrigen = params.get('tipoAlmacen'); // ej: almacen
      
      if(this.tipoAlmacenOrigen == "almacen"){
        this.idAlmacenOrigen = this.paramGet.parent?.snapshot.paramMap.get('idAlmacen');
        this.idClienteOrigen = "1";
      }

      if(this.tipoAlmacenOrigen == "cliente"){
        this.idClienteOrigen = this.paramGet.parent?.snapshot.paramMap.get('idCliente');
        this.idAlmacenOrigen = "1";
      }

      console.log("ENTRO", this.tipoSalida, this.tipoAlmacenOrigen, this.idAlmacenOrigen, this.idClienteOrigen)
    });
  }

  ngAfterViewInit(): void {

    if (this.tipoSalida == 'venta') {
      this.lblTipo = "Venta"
      setTimeout(()=>{
        this.listaCuentaByEstado();
      }, 100);
    }
    if (this.tipoSalida == 'traspaso') {
      this.lblTipo = "Traspaso"
      setTimeout(()=>{
        this.listaAlmacenByEstado();
      }, 100);
    }

    if(this.tipoAlmacenOrigen == "almacen"){
      setTimeout(()=>{
        this.almacenById();
      }, 100);
    }

    if(this.tipoAlmacenOrigen == "cliente"){
      setTimeout(()=>{
        this.clienteById();
      }, 100);
    }

    setTimeout(()=>{
      this.listaInventarioProductoByAlmacen();
      this.listaClientesByEstado();
    }, 100);
  }

  ngOnDestroy(): void {

  }

  change_productoSeleccionado(){
    console.log(this.cboxProducto)
    this.txtPrecio = this.cboxProducto["precioProducto"]
    this.cantMax = parseInt(this.cboxProducto["cantidad"]);

    this.listaInventarioProductoByAlmacenProducto();
  }

  change_almacenDestino(){
    this.idClienteDestino = "1"
    console.log(this.idAlmacenDestino, this.idClienteDestino)
  }

  change_clienteDestino(){
    this.idAlmacenDestino = '1';
    console.log(this.idAlmacenDestino, this.idClienteDestino)
  }

  click_seleccionarProducto(element:any){
    this.idInventarioProducto = element.idInventarioProducto
    $('#modalTraspasoCantidad').modal('show');
  }

  click_tipoAlmacen(tipo:any){
    this.tipoAlmacen = tipo;
    this.idAlmacenDestino = '1';
    this.idClienteDestino = "1";
    console.log(this.idAlmacenDestino, this.idClienteDestino)
  }

  click_salida(){
    if (this.tipoSalida == 'venta') {
      this.agregarVenta();
    }

    if (this.tipoSalida == 'traspaso') {
      this.agregarTraspaso();
    }
  }

  

  click_agregarProducto(){
    if (parseInt(this.txtCantidad) > parseInt(this.cantMax)) {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'La cantidad que ingresaste no está disponible en el almacén. La cantidad máxima es: ' + this.cantMax, confirmButtonText: 'Ok' });
      return;
    }

    if (parseInt(this.txtCantidad) <= 0) {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'La cantidad que ingresaste no es correcto. ingrese mayor a 0', confirmButtonText: 'Ok' });
      return;
    }

    if (this.cboxProducto == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona un producto.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtCantidad == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa la cantidad de venta.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtPrecio == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el precio unitario de venta.', confirmButtonText: 'Ok' });
      return;
    }

    let subTotal = parseInt(this.txtCantidad) * parseFloat(this.txtPrecio)
    this.listaCarrito.push({
      "idInventarioProducto": this.idInventarioProducto,
      "idProducto": this.cboxProducto.idProducto,
      "nombre": this.cboxProducto.nombreProducto,
      "codigoLiteral": this.cboxProducto.codigoLiteral,
      "cantidad": this.txtCantidad,
      "precio": parseFloat(this.txtPrecio).toFixed(2),
      "subTotal": subTotal.toFixed(2)
    })

    $('#modalTraspasoCantidad').modal('hide');
    this.listaProductosInventario = []
    this.txtCantidad = ""
    this.txtPrecio = ""

    this.calculaTotal();
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
    this.precioTotal = parseFloat(this.total) - parseFloat(this.descuento)
    this.lblTotal = parseFloat(this.precioTotal).toFixed(2);
  }

  agregarVenta(){
    if (this.listaCarrito.length == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Por favor, selecciona productos. el carrito de productos está vacío.',
        confirmButtonText: 'Ok',
      });
      return;
    }
        if (this.cboxCuenta == "") {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona una cuenta.', confirmButtonText: 'Ok' });
          return;
        }

        if (this.cboxCliente == "") {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona un cliente.', confirmButtonText: 'Ok' });
          return;
        }
    
        let parametros = {
          "idLogin": localStorage.getItem("idLogin"),
          "tipoAlmacenOrigen": this.tipoAlmacenOrigen,
          "idCuenta": this.cboxCuenta,
          "idAlmacen": this.idAlmacenOrigen,
          "idClienteOrigen": this.idClienteOrigen,
          "idCliente": this.cboxCliente,
          "productos": this.listaCarrito,
          "total": this.total,
          "descuento": this.descuento,
          "precioTotal": this.precioTotal,
          "observacion": '',
          "credito": '0',
          "metodoPago": 'Efectivo',
          "pagado": '1'
        };
    
        this.ventaHttpService.agregarVenta(parametros).subscribe(res => {
          if (this.alertaSwalService.mostrarErrorHttp(res)){
            return
          }
    
          const body = res.body;
          let data = body.data
          this.toastr.success('Venta realizado correctamente')
          this.location.back();
        });
  }

  agregarTraspaso(){
    if (this.listaCarrito.length == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Error de Texto',
        text: 'Por favor, selecciona productos. el carrito de productos está vacío.',
        confirmButtonText: 'Ok',
      });
      return;
    }

    if (this.tipoAlmacen == 'almacen') {
      if (this.idAlmacenOrigen == this.idAlmacenDestino) {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, seleccione otro almacen de destino.', confirmButtonText: 'Ok' });
        return;
      }

      if (this.idAlmacenDestino == "" || this.idAlmacenDestino == "1") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona un almacen de destino.', confirmButtonText: 'Ok' });
        return;
      }
    }

    if (this.tipoAlmacen == 'cliente') {
      if (this.idClienteOrigen == this.idClienteDestino) {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, seleccione otro cliente de destino.', confirmButtonText: 'Ok' });
        return;
      }

      if (this.idClienteDestino == "" || this.idClienteDestino == "1") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona un cliente de destino.', confirmButtonText: 'Ok' });
        return;
      }
    }

    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idCuenta": this.cboxCuenta,
      "idAlmacenOrigen": this.idAlmacenOrigen,
      "idAlmacenDestino": this.idAlmacenDestino,
      "idClienteOrigen": this.idClienteOrigen,
      "idClienteDestino": this.idClienteDestino,
      "tipoAlmacen": this.tipoAlmacen,
      "tipoAlmacenOrigen": this.tipoAlmacenOrigen,
      "detalle": this.txtDetalle,
      "productos": this.listaCarrito,
      "total": this.total,
      "pagado": '1'
    };

    this.traspasoHttpService.agregarTraspaso(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.toastr.success('Traspaso realizado correctamente')
      this.location.back();
    });
}

  clienteById(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idCliente": this.idClienteOrigen,
    };
    this.clienteHttpService.clienteById(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.lblAlmacenOrigen = data['cliente'];
    });
  }

  almacenById(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idAlmacen": this.idAlmacenOrigen,
    };
    this.almacenHttpService.almacenById(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.lblAlmacenOrigen = data['nombreAlmacen'];
    });
  }
  

  listaInventarioProductoByAlmacen(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idAlmacen": this.idAlmacenOrigen,
      "idCliente": this.idClienteOrigen,
      "tipoAlmacen": this.tipoAlmacenOrigen,
      "estado": "1",
    };
    this.productoHttpService.listaInventarioProductoByAlmacen(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaProductos = data["productos"];
      console.log(this.listaProductos)
    });
  }

  listaInventarioProductoByAlmacenProducto() {
    let parametros = {
      "idLogin": localStorage.getItem('idLogin'),
      "tipoAlmacen": this.tipoAlmacen,
      "idAlmacen": this.idAlmacenOrigen,
      "idCliente": "1",
      "idProducto": this.cboxProducto.idProducto,
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

  listaClientesByEstado(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "estado": "1",
    };
    this.clienteHttpService.listaClientesByEstado(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaClientes = data;
    });
  }
}
