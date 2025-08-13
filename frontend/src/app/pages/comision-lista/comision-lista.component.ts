import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { UsuarioHttpService } from '../../client/usuario-http.service';
import { VentaHttpService } from '../../client/venta-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;


@Component({
  selector: 'app-comision-lista',
  templateUrl: './comision-lista.component.html',
  styleUrls: ['./comision-lista.component.css']
})
export class ComisionListaComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(DataTableDirective, {static: false})

  dtElement:any = DataTableDirective;
  dtOptions: any = {}
  dtTrigger: Subject<any> = new Subject<any>();

  idRol:any = "";
  idUsuario:any = "1";
  idSucursal:any = "1";
  idVenta:any = "1";

  lblTitulo:any = "";

  listaComisiones:any = [];

  constructor(
    private paramGet: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private usuarioHttpService: UsuarioHttpService,
    private ventaHttpService: VentaHttpService,
  ) { }

  ngOnInit(): void {
    this.idRol = localStorage.getItem("idRol")

    this.paramGet.paramMap.subscribe((params) => {
      this.idSucursal = this.paramGet.parent?.snapshot.paramMap.get('idSucursal') ?? "1";
      this.idUsuario = params.get('idUsuario') ?? "1";

      this.lblTitulo = "Por Usuario"
      if(this.idSucursal != "1"){
        this.lblTitulo = "Por Sucursal"
      }

      console.log(this.idSucursal, this.idUsuario);
    });
    

    setTimeout(()=>{
      this.listaComisionByComision()
    }, 200);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(environment.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  click_pagarComision(element:any){
      this.idVenta = element.idVenta;
  
      Swal.fire({
        title: '¿Pagar Comisión?',
        text: `Estas a punto de pagar la comisión`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c82333',
        cancelButtonColor: '#6e7881',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Pagar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.actualizarEstadoComisionById();
        }
      });  
    }

    actualizarEstadoComisionById() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      idVenta: this.idVenta,
      "estadoComision": "Comision Pagada",
      estado: '1',
    };
    this.ventaHttpService
      .actualizarEstadoComisionById(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;
        this.toastr.success('Pago de comision realizado correctamente');

        this.listaComisionByComision();
      });
  }

  listaComisionByComision(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "comision": "1",
      "idUsuario": this.idUsuario,
      "idSucursal": this.idSucursal
    };
    this.ventaHttpService.listaComisionByComision(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaComisiones = data;

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(environment.dtOptions);
      });
    });
  }
}
