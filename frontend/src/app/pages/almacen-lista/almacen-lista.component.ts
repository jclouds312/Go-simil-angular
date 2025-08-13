import { AfterViewInit, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { AlmacenHttpService } from '../../client/almacen-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-almacen-lista',
  templateUrl: './almacen-lista.component.html',
  styleUrls: ['./almacen-lista.component.css']
})
export class AlmacenListaComponent implements OnInit, AfterViewInit, OnDestroy{

  idAlmacen:any = ""
  txtNombre:any = "";
  

  listaAlmacen:any = []

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private almacenHttpService: AlmacenHttpService,
  ) { }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalAlmacenAgregar').hasClass('show')) {
      $('#modalAlmacenAgregar').modal('hide');
    }
  }
  
    ngOnInit(): void {
      $('#modalAlmacenAgregar').on('shown.bs.modal', () => {
          history.pushState(null, '', window.location.href);
        });
    }

    ngAfterViewInit(): void {
      this.listaAlmacenByEstado()
    }
  
    ngOnDestroy(): void {

    }

    click_almacen(element:any){
      this.router.navigate(['almacen', element.idAlmacen]).then(() => {
        //window.location.reload();
      });
    }

    click_agregarAlmacen(){
      $('#modalAlmacenAgregar').modal('show');
    }

    

    

    agregarAlmacen(){
      if (this.txtNombre == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el nombre del almacén.', confirmButtonText: 'Ok' });
        return;
      }

      let parametros = {
        "idLogin": localStorage.getItem("idLogin"),
        "nombre": this.txtNombre,
        "descripcion": ''
      };
      this.almacenHttpService.agregarAlmacen(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        
        this.txtNombre = "";
        $('#modalAlmacenAgregar').modal('hide');
        this.toastr.success('Almacén creado correctamente')
        this.listaAlmacenByEstado()
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
}
