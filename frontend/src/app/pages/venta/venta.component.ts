import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { AlmacenHttpService } from '../../client/almacen-http.service';
import { SucursalHttpService } from '../../client/sucursal-http.service';
import { ClienteHttpService } from '../../client/cliente-http.service';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { VentaHttpService } from '../../client/venta-http.service';
import { RecetaHttpService } from '../../client/receta-http.service';
import { PrecioVentaHttpService } from '../../client/precioventa-http.service';
import { ProductoHttpService } from '../../client/producto-http.service';
import { DescuentoHttpService } from '../../client/descuento-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
import { ModalVentaCreditoAgregarComponent } from 'src/app/components/modal-venta-credito-agregar/modal-venta-credito-agregar.component';
declare var $:any;

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(ModalVentaCreditoAgregarComponent) modalPagoCredito!: ModalVentaCreditoAgregarComponent;

  idRol:any = "";
  idSucursal:any = "";
  almacenOrigen:any = "";
  idAlmacen:any = "";
  idProducto:any = "";
  idPrecioVenta:any = "";
  idVenta:any = "";
  idReceta:any = "";
  idInventarioProducto:any = "";

  idAlmacenOrigen:any = "";
  idClienteOrigen:any = "";
  idAlmacenDestino:any = "";
  idClienteDestino:any = "";
  tipoSalida:any = "";
  tipoAlmacen:any = "almacen";
  tipoAlmacenOrigen:any = "almacen";
  
  cboxCliente:any = "";
  cboxCuenta:any = "";
  cboxProducto:any = "";
  txtCantidad:any = "";
  txtPrecio:any = "";
  txtDetalle:any = "";

  txtCreditoMonto:any = "";

  txtCilindroIzq:any = "";
  txtCilindroDer:any = "";
  txtEsferaIzq:any = "";
  txtEsferaDer:any = "";
  txtEjeIzq:any = "";
  txtEjeDer:any = "";
  txtAddIzq:any = "";
  txtAddDer:any = "";
  txtAo:any = "";
  txtDip:any = "";
  txtArmazon:any = "";
  txtBifocal:any = "";
  txtMaterial:any = "";
  txtTratamiento:any = "";

  costo:any = 0.00;
  cantMax:any = 0;
  total:any = 0.00;
  descuento:any = 0.00
  precioTotal:any = 0.00

  idDescuento:any = "1";
  descuentoMultiplo:any = 1;
  descuentoPorcentaje:any = 0.00;
  descuentoVenta:any = 0.00;
  lblDescuentoSeleccionado:any = "";

  lblTipo:any = "";

  lblAlmacenOrigen:any = "";

  lblTotal:any = 0.00;
  
  listaAlmacen: any = [];
  listaClientes: any = [];
  listaCuentas: any = [];
  listaProductos: any = [];
  listaCarrito: any = [];
  listaPrecioVenta:any = [];
  listaProductosInventario: any = [];
  listaDescuentoProducto: any = [];

  constructor(
    private paramGet: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private almacenHttpService: AlmacenHttpService,
    private sucursalHttpService: SucursalHttpService,
    private clienteHttpService: ClienteHttpService,
    private cuentaHttpService: CuentaHttpService,
    private ventaHttpService: VentaHttpService,
    private recetaHttpService: RecetaHttpService,
    private productoHttpService: ProductoHttpService,
    private precioVentaHttpService: PrecioVentaHttpService,
    private descuentoHttpService: DescuentoHttpService,
  ) {}

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalProductosInventario').hasClass('show')) {
      $('#modalProductosInventario').modal('hide');
    }
    if ($('#modalPrecioVenta').hasClass('show')) {
      $('#modalPrecioVenta').modal('hide');
    }
    if ($('#modalPagoCredito').hasClass('show')) {
      $('#modalPagoCredito').modal('hide');
    }
  }

  ngOnInit(): void {
    $('#modalProductosInventario').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    $('#modalPrecioVenta').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    $('#modalPagoCredito').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    this.idRol = localStorage.getItem("idRol")

    this.paramGet.parent?.paramMap.subscribe((params) => {
      this.idSucursal = params.get('idSucursal');

      if (this.idSucursal == undefined) {
        this.idSucursal = "1";
      }
    });
  }

  ngAfterViewInit(): void {
    this.listaCuentaByEstado();
    this.listaAlmacenBySucursal();
    this.listaClientesByEstado();
  }

  ngOnDestroy(): void {
  }

  eventOutput_pagoConfirmado(element:any){

  }

  change_productoSeleccionado(){
    console.log(this.cboxProducto)
    this.idProducto = this.cboxProducto['idProducto'];

    this.listaInventarioProductoByAlmacenProducto();

    $('#modalProductosInventario').modal('show');
    //this.listaPrecioVentaByCostoEstado();
    //this.txtPrecio = this.cboxProducto["precioProducto"]
    //this.cantMax = parseInt(this.cboxProducto["cantidad"]);
  }

  change_almacenSeleccionado(){
    console.log(this.almacenOrigen)
    this.idAlmacen = this.almacenOrigen['idAlmacen'];
    this.listaInventarioProductoByAlmacen();
  }

  click_verDescuentos(){
    this.listaDescuentoByProductoEstado();

    $('#modalDescuentoProducto').modal('show');
  }

  click_verPrecios(element:any){
    this.idInventarioProducto = element.idInventarioProducto;
    this.costo = element.costo;
    this.cantMax = element.cantidad;
    this.txtPrecio = element.precioProducto
    this.idPrecioVenta = "1";

    $('#modalProductosInventario').modal('hide');
    
    /*this.listaPrecioVentaByCostoEstado();
    $('#modalProductosInventario').modal('hide');
    $('#modalPrecioVenta').modal('show');*/
  }

  click_seleccionarProducto(element:any){
    this.txtPrecio = element.precioVenta
    this.idPrecioVenta = element.idPrecioVenta;
    $('#modalPrecioVenta').modal('hide');
  }

  click_seleccionarDescuento(element:any){
    this.idDescuento = element.idDescuento;
    this.descuentoMultiplo = element.multiplo;
    this.descuentoPorcentaje = element.porcentaje;
    this.descuentoVenta = (parseFloat(this.txtPrecio) * (0.01 * parseFloat(element.porcentaje))).toFixed(2);
    this.lblDescuentoSeleccionado = `Descuento de ${this.descuentoPorcentaje}% = $${this.descuentoVenta} -> Minimo = ${this.descuentoMultiplo} uds.`;

    $('#modalDescuentoProducto').modal('hide');
  }

  click_eliminarDescuento(){
    this.idDescuento = "1";
    this.descuentoMultiplo = 1;
    this.descuentoPorcentaje = 0.00;
    this.lblDescuentoSeleccionado = ""
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

        if (this.idInventarioProducto == "") {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona un producto del inventario.', confirmButtonText: 'Ok' });
          return;
        }

        if (parseInt(this.txtCantidad) % parseInt(this.descuentoMultiplo) > 0) {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Cantidad incorrecta, porfavor seleccione una cantidad multiple de ' + this.descuentoMultiplo, confirmButtonText: 'Ok' });
          return;
        }
    
        let precioFinal = (parseFloat(this.txtPrecio) - parseFloat(this.descuentoVenta))
        let subTotal = parseInt(this.txtCantidad) * precioFinal
        this.listaCarrito.push({
          "idInventarioProducto": this.idInventarioProducto,
          "idDescuento": this.idDescuento,
          "idProducto": this.cboxProducto.idProducto,
          "idPrecioVenta": this.idPrecioVenta,
          "nombre": this.cboxProducto.nombreProducto,
          "codigoLiteral": this.cboxProducto.codigoLiteral,
          "cantidad": this.txtCantidad,
          "precio": parseFloat(this.txtPrecio).toFixed(2),
          "descuento": parseFloat(this.descuentoVenta).toFixed(2),
          "precioFinal": precioFinal.toFixed(2),
          "subTotal": subTotal.toFixed(2)
        })
    
        this.cboxProducto = "";
        this.idInventarioProducto = ""
        this.idPrecioVenta = ""
        this.txtCantidad = ""
        this.txtPrecio = ""

        this.idDescuento = "1";
        this.descuentoMultiplo = 1;
        this.descuentoPorcentaje = 0.00;
        this.lblDescuentoSeleccionado = ""

    
        this.calculaTotal();
      }
    
      
    
      click_eliminarProducto(element:any){
        const index = this.listaCarrito.indexOf(element);
        if (index > -1) {
          this.listaCarrito.splice(index, 1);
        }
        this.calculaTotal();
      }

      click_agregarVenta(){
        Swal.fire({
          title: '¿Vender?',
          text: `Estas a punto de vender con un valor de $ ${this.lblTotal}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#c82333',
          cancelButtonColor: '#6e7881',
          cancelButtonText: "Cancelar",
          confirmButtonText: 'Vender!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.agregarVenta()
          }
        })  
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
  
          if (this.cboxCliente == "") {
            Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, selecciona un cliente.', confirmButtonText: 'Ok' });
            return;
          }
      
          let parametros = {
            "idLogin": localStorage.getItem("idLogin"),
            "idSucursal": this.idSucursal,
            "idAlmacen": this.idAlmacen,
            "idClienteOrigen": "1",
            "idCliente": this.cboxCliente,
            "productos": this.listaCarrito,
            "total": this.total,
            "descuento": this.descuento,
            "precioTotal": this.precioTotal,
            "observacion": this.txtDetalle,
            "credito": '0',
            "metodoPago": '',
            "pagado": '0'
          };
      
          this.ventaHttpService.agregarVenta(parametros).subscribe(res => {
            if (this.alertaSwalService.mostrarErrorHttp(res)){
              return
            }
      
            const body = res.body;
            let data = body.data
            this.idVenta = data['idVenta'];
            
            this.cboxProducto = ""
            this.listaCarrito = []
            this.txtPrecio = ""
            this.txtCantidad = ""
            this.cboxCliente = ""
            this.txtDetalle = ""
            this.lblTotal = 0.00;

            this.toastr.success('Venta realizado correctamente')

            Swal.fire({
              title: 'Generar Receta?',
              text: `Estás a punto de generar una receta`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#c82333',
              cancelButtonColor: '#6e7881',
              cancelButtonText: "No",
              confirmButtonText: 'Generar!',
            }).then((result) => {
              if (result.isConfirmed) {
                $('#modalRecetaAgregar').modal('show');
              } else {
                let dataOut = {
                  idVenta: this.idVenta
                }
                this.modalPagoCredito.eventInput_abrirModal(dataOut);
              }
            });
            
            
          });
    }

    agregarReceta(){
          if (this.txtCilindroIzq == "") {
            Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el dato del cilindro izquierdo.', confirmButtonText: 'Ok' });
            return;
          }

          if (this.txtCilindroDer == "") {
            Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el dato del cilindro derecho.', confirmButtonText: 'Ok' });
            return;
          }

          if (this.txtEsferaIzq == "") {
            Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el dato del Esfera izquierdo.', confirmButtonText: 'Ok' });
            return;
          }

          if (this.txtEsferaDer == "") {
            Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el dato del Esfera derecho.', confirmButtonText: 'Ok' });
            return;
          }

          if (this.txtEjeIzq == "") {
            Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el dato del Eje izquierdo.', confirmButtonText: 'Ok' });
            return;
          }

          if (this.txtEjeDer == "") {
            Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el dato del Eje derecho.', confirmButtonText: 'Ok' });
            return;
          }

          if (this.txtAddIzq == "") {
            Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el dato del Add izquierdo.', confirmButtonText: 'Ok' });
            return;
          }

          if (this.txtAddDer == "") {
            Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el dato del Add derecho.', confirmButtonText: 'Ok' });
            return;
          }
    
          let parametros = {
            "idLogin": localStorage.getItem("idLogin"),
            "cilindroIzq": this.txtCilindroIzq,
            "cilindroDer": this.txtCilindroDer,
            "esferaIzq": this.txtEsferaIzq,
            "esferaDer": this.txtEsferaDer,
            "ejeIzq": this.txtEjeIzq,
            "ejeDer": this.txtEjeDer,
            "addIzq": this.txtAddIzq,
            "addDer": this.txtAddDer,
            "ao": this.txtAo,
            "dip": this.txtDip,
            "armazon": this.txtArmazon,
            "bifocal": this.txtBifocal,
            "material": this.txtMaterial,
            "tratamiento": this.txtTratamiento,
            "idVenta": this.idVenta,
          };
          this.recetaHttpService.agregarReceta(parametros).subscribe(res => {
            if (this.alertaSwalService.mostrarErrorHttp(res)){
              return
            }
      
            const body = res.body;
            let data = body.data
            this.idReceta = data['idReceta'];

            this.txtCilindroIzq = "";
            this.txtCilindroDer = "";
            this.txtEsferaIzq = "";
            this.txtEsferaDer = "";
            this.txtEjeIzq = "";
            this.txtEjeDer = "";
            this.txtAddIzq = "";
            this.txtAddDer = "";
            this.txtMaterial = "";
            this.txtTratamiento = "";

            $('#modalRecetaAgregar').modal('hide');
            this.toastr.success('Receta generado correctamente')

            Swal.fire({
              title: 'Imprimir Receta?',
              text: `Desea imprimir la receta`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#c82333',
              cancelButtonColor: '#6e7881',
              cancelButtonText: "No",
              confirmButtonText: 'Imprimir!',
            }).then((result) => {
              if (result.isConfirmed) {
                this.documentoPdfRecetaById();
              } else {
                let dataOut = {
                  idVenta: this.idVenta
                }
                this.modalPagoCredito.eventInput_abrirModal(dataOut);
              }
            });
          });
        }

  listaInventarioProductoByAlmacen(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idAlmacen": this.idAlmacen,
      "idCliente": "1",
      "tipoAlmacen": "almacen",
      "estado": "1",
    };
    this.productoHttpService.listaInventarioProductoByAlmacen(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaProductos = data["productos"];
    });
  }

  listaInventarioProductoByAlmacenProducto() {
    let parametros = {
      "idLogin": localStorage.getItem('idLogin'),
      "tipoAlmacen": "almacen",
      "idAlmacen": this.idAlmacen,
      "idCliente": "1",
      "idProducto": this.idProducto,
      "cantidad": "0",
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

  listaPrecioVentaByCostoEstado(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "costo": this.costo,
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

  listaDescuentoByProductoEstado(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idProducto": this.idProducto,
      "estado": "1",
    };
    this.descuentoHttpService.listaDescuentoByProductoEstado(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaDescuentoProducto = data;
    });
  }

  documentoPdfRecetaById() {
      let parametros = {
        idLogin: localStorage.getItem('idLogin'),
        idVenta: this.idVenta,
        idReceta: this.idReceta,
        estado: '1',
      };
      this.recetaHttpService
        .documentoPdfRecetaById(parametros)
        .subscribe((res) => {
          if (this.alertaSwalService.mostrarErrorHttp(res)) {
            return;
          }
  
          const body = res.body;
          let data = body.data;
          console.log(data)
  
          const base64 = data["documentoBase64"];
          const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = url;
          link.download = data["documentoNombre"];
          link.click();
          URL.revokeObjectURL(url);
        });
    }
}
