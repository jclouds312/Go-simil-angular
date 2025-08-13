import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { ClienteHttpService } from '../../client/cliente-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-cliente-contenedor',
  templateUrl: './cliente-contenedor.component.html',
  styleUrls: ['./cliente-contenedor.component.css']
})
export class ClienteContenedorComponent implements OnInit, AfterViewInit, OnDestroy{

  idCliente:any = "";

  lblClienteNombre:any = "";
  lblClienteAppat:any = "";
  lblClienteCelular:any = "";

  constructor(
    private paramGet: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private clienteHttpService: ClienteHttpService
  ) {}

  ngOnInit(): void {
    this.paramGet.params.subscribe((params) => {
      this.idCliente = params['idCliente'];
    });
  }

  ngAfterViewInit(): void {
    this.clienteById();
  }

  ngOnDestroy(): void {}

  click_inventario() {
    this.router
      .navigate(['inventario'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_traspasoNuevo() {
    this.router
      .navigate(['salida', 'traspaso', 'cliente'], {
        relativeTo: this.paramGet,
      })
      .then(() => {
        //window.location.reload();
      });
  }

  click_listaTraspaso() {
    this.router
      .navigate(['traspaso', 'cliente'], {
        relativeTo: this.paramGet,
      })
      .then(() => {
        //window.location.reload();
      });
  }

  click_ventaNueva() {
    this.router
      .navigate(['salida', 'venta', 'cliente'], { relativeTo: this.paramGet })
      .then(() => {
        //window.location.reload();
      });
  }

  click_listaVenta(){
    this.router
      .navigate(['venta', 'cliente'], {
        relativeTo: this.paramGet,
      })
      .then(() => {
        //window.location.reload();
      });
  }

  clienteById(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idCliente": this.idCliente,
    };
    this.clienteHttpService.clienteById(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.lblClienteNombre = data['nombre'];
      this.lblClienteAppat = data['appat'] + " " + data['apmat'];
      this.lblClienteCelular = data['celular'];
    });
  }
}
