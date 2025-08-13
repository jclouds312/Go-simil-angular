import { AfterViewInit, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { SucursalHttpService } from '../../client/sucursal-http.service';
import { UsuarioHttpService } from '../../client/usuario-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-sucursal-lista',
  templateUrl: './sucursal-lista.component.html',
  styleUrls: ['./sucursal-lista.component.css']
})
export class SucursalListaComponent implements OnInit, AfterViewInit, OnDestroy{

  idRol:any = "";
  idSucursal:any = ""
  txtNombre:any = "";
  

  listaSucursal:any = []

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private sucursalHttpService: SucursalHttpService,
    private usuarioHttpService: UsuarioHttpService,
  ) { }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalSucursalAgregar').hasClass('show')) {
      $('#modalSucursalAgregar').modal('hide');
    }
  }
  
    ngOnInit(): void {
      $('#modalSucursalAgregar').on('shown.bs.modal', () => {
          history.pushState(null, '', window.location.href);
        });

        this.idRol = localStorage.getItem("idRol")
    }

    ngAfterViewInit(): void {
      if(this.idRol == "Administrador"){
        this.listaSucursalByEstado()
      } else {
        this.listaSucursalByUsuario()
      }
      
    }
  
    ngOnDestroy(): void {

    }

    click_sucursal(element:any){
      this.router.navigate(['sucursal', element.idSucursal]).then(() => {
        //window.location.reload();
      });
    }

    click_agregarSucursal(){
      $('#modalSucursalAgregar').modal('show');
    }

    

    

    agregarSucursal(){
      if (this.txtNombre == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el nombre del sucursal.', confirmButtonText: 'Ok' });
        return;
      }

      let parametros = {
        "idLogin": localStorage.getItem("idLogin"),
        "nombre": this.txtNombre,
        "descripcion": ''
      };
      this.sucursalHttpService.agregarSucursal(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        
        this.txtNombre = "";
        $('#modalSucursalAgregar').modal('hide');
        this.toastr.success('Sucursal creado correctamente')
        this.listaSucursalByEstado()
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
        this.listaSucursal = data;
      });
    }

    listaSucursalByUsuario(){
      let parametros = {
        "idLogin": localStorage.getItem("idLogin"),
        "estado": "1",
      };
      this.usuarioHttpService.listaSucursalByUsuario(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        this.listaSucursal = data;
      });
    }
}
