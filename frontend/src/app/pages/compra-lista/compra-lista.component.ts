import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { CompraHttpService } from '../../client/compra-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-compra-lista',
  templateUrl: './compra-lista.component.html',
  styleUrls: ['./compra-lista.component.css'],
})
export class CompraListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any = DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  idCompra: any = '';

  lblTotal: any = 0;

  lblCompraNro:any = "";
  lblDetalleAlmacen:any = "";
  lblDetalleCuenta:any = "";
  lblDetalleFecha:any = "";
  lblDetalleUsuario:any = "";
  lblDetalleTotal:any = 0.00;
  lblDetalleTotalPuntos:any = 0;

  listaCompras: any = [];
  listaCompraDetalle: any = [];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private compraHttpService: CompraHttpService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.listaCompraByEstado();
    }, 200);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(environment.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  click_agregarCompra() {
    this.router.navigate(['compra/nueva']).then(() => {
      //window.location.reload();
    });
  }

  click_verCompra(element: any) {
    this.idCompra = element["idCompra"];
    this.lblCompraNro = element["idCompra"];
    this.lblDetalleFecha = element["fechaCompra"] + " - " + element["horaCompra"];
    this.lblDetalleAlmacen = element["nombreAlmacen"];
    this.lblDetalleCuenta = element["nombreCuenta"];
    this.lblDetalleUsuario = element["usuario"];
    
    this.listaCompraDetalleByIdCompra();

    $('#modalCompraDetalle').modal('show');
  }

  listaCompraByEstado() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      estado: '1',
    };
    this.compraHttpService.listaCompraByEstado(parametros).subscribe((res) => {
      if (this.alertaSwalService.mostrarErrorHttp(res)) {
        return;
      }

      const body = res.body;
      let data = body.data;
      this.listaCompras = data["compras"];
      this.lblTotal = data["totalFormato"]

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(environment.dtOptions);
      });
    });
  }

  listaCompraDetalleByIdCompra() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idCompra: this.idCompra,
      estado: '1',
    };
    this.compraHttpService.listaCompraDetalleByIdCompra(parametros).subscribe((res) => {
      if (this.alertaSwalService.mostrarErrorHttp(res)) {
        return;
      }

      const body = res.body;
      let data = body.data;
      this.listaCompraDetalle = data["detalles"];
      this.lblDetalleTotal = data["totalFormato"]
      this.lblDetalleTotalPuntos = data['totalPuntos'];
      console.log(data);
    });
  }
}
