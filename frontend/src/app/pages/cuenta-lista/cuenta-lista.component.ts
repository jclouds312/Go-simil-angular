import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { SucursalHttpService } from '../../client/sucursal-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-cuenta-lista',
  templateUrl: './cuenta-lista.component.html',
  styleUrls: ['./cuenta-lista.component.css']
})
export class CuentaListaComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(DataTableDirective, {static: false})

  dtElement:any = DataTableDirective;
  dtOptions: any = {}
  dtTrigger: Subject<any> = new Subject<any>();

  idRol:any = "";
  idSucursal:any = "";
  idSucursalAgregar:any = "";
  idCuenta:any = ""
  txtNombre:any = "";
  txtBanco:any = "";
  txtNroCuenta:any = "";

  listaCuentas:any = [];
listaSucursales:any = [];
  constructor(
    private paramGet: ActivatedRoute,
      private router: Router,
      private toastr: ToastrService,
      private alertaSwalService: AlertaSwalService,
      private cuentaHttpService: CuentaHttpService,
      private sucursalHttpService: SucursalHttpService
    ) { }

    @HostListener('window:popstate', ['$event'])
    onPopState(event: any) {
      // Si el modal está abierto
      if ($('#modalCuentaAgregar').hasClass('show')) {
        $('#modalCuentaAgregar').modal('hide');
      }
    }
    
      ngOnInit(): void {
        $('#modalCuentaAgregar').on('shown.bs.modal', () => {
          history.pushState(null, '', window.location.href);
        });
        this.idRol = localStorage.getItem("idRol")

        this.paramGet.paramMap.subscribe((params) => {
          this.idSucursal = this.paramGet.parent?.snapshot.paramMap.get('idSucursal');
          console.log(this.idSucursal)
          if(this.idSucursal == null || this.idSucursal == undefined){
            this.idSucursal = "";
          }
        });

        setTimeout(()=>{
          if(this.idSucursal == ""){
            this.listaCuentaByEstado();
          } else {
            this.listaCuentaBySucursalEstado()
          }
          
        }, 200);
      }
  
      ngAfterViewInit(): void {
        this.dtTrigger.next(environment.dtOptions);
      }
    
      ngOnDestroy(): void {
        this.dtTrigger.unsubscribe();
      }
  
      click_agregarCuenta(){
        this.listaSucursalByEstado();

        $('#modalCuentaAgregar').modal('show');
      }

      click_verCuenta(element:any){
        this.router.navigate(['cuenta/historial', element.idCuenta]).then(() => {
          //window.location.reload();
        });
      }

      agregarCuenta(){
            if (this.txtNombre == "") {
              Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el nombre de la cuenta.', confirmButtonText: 'Ok' });
              return;
            }
      
            let parametros = {
              "idLogin": localStorage.getItem("idLogin"),
              "idSucursal": this.idSucursalAgregar,
              "alias": this.txtNombre,
              "banco": this.txtBanco,
              "numeroCuenta": this.txtNroCuenta,
            };
            this.cuentaHttpService.agregarCuenta(parametros).subscribe(res => {
              if (this.alertaSwalService.mostrarErrorHttp(res)){
                return
              }
        
              const body = res.body;
              let data = body.data
              
              this.txtNombre = "";
              this.txtBanco = "";
              this.txtNroCuenta = "";
              $('#modalCuentaAgregar').modal('hide');
              this.toastr.success('Cuenta creada correctamente')
              if(this.idSucursal == ""){
                this.listaCuentaByEstado();
              } else {
                this.listaCuentaBySucursalEstado()
              }
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
  
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(environment.dtOptions);
          });
  
        });
      }

      listaCuentaBySucursalEstado(){
        let parametros = {
          "idLogin": localStorage.getItem("idLogin"),
          "idSucursal": this.idSucursal,
          "estado": "1",
        };
        this.cuentaHttpService.listaCuentaBySucursalEstado(parametros).subscribe(res => {
          if (this.alertaSwalService.mostrarErrorHttp(res)){
            return
          }
    
          const body = res.body;
          let data = body.data
          this.listaCuentas = data;
  
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next(environment.dtOptions);
          });
  
        });
      }

      listaSucursalByEstado(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "estado": "1",
    };
    this.sucursalHttpService.listaSucursalByEstado(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaSucursales = data;
    });
  }
  
}
