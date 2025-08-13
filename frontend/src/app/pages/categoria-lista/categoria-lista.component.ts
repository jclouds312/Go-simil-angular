import { AfterViewInit, Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { CategoriaHttpService } from '../../client/categoria-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-categoria-lista',
  templateUrl: './categoria-lista.component.html',
  styleUrls: ['./categoria-lista.component.css']
})
export class CategoriaListaComponent implements OnInit, AfterViewInit, OnDestroy{

  idCategoria:any = ""
  txtNombre:any = "";
  txtMeta:any = "";
  txtPorcentaje:any = "";

  txtNombreEditar:any = "";
  txtMetaEditar:any = "";
  txtPorcentajeEditar:any = "";
  

  listaCategoria:any = []

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private categoriaHttpService: CategoriaHttpService,
  ) { }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalCategoriaAgregar').hasClass('show')) {
      $('#modalCategoriaAgregar').modal('hide');
    }
  }
  
    ngOnInit(): void {
      $('#modalCategoriaAgregar').on('shown.bs.modal', () => {
          history.pushState(null, '', window.location.href);
        });
    }

    ngAfterViewInit(): void {
      this.listaCategoriaByEstado()
    }
  
    ngOnDestroy(): void {

    }

    click_categoria(element:any){
      this.router.navigate(['categoria', element.idCategoria]).then(() => {
        //window.location.reload();
      });
    }

    click_agregarCategoria(){
      $('#modalCategoriaAgregar').modal('show');
    }

    click_actualizarDatos(element:any){
      this.txtNombreEditar = element.nombreCategoria;
      this.txtMetaEditar = element.meta;
      this.txtPorcentajeEditar = element.porcentaje;
      this.idCategoria = element.idCategoria;

      $('#modalCategoriaEditar').modal('show');
    }

    

    

    agregarCategoria(){
      if (this.txtNombre == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el nombre del categoria.', confirmButtonText: 'Ok' });
        return;
      }

      if (this.txtPorcentaje == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el porcentaje del categoria.', confirmButtonText: 'Ok' });
        return;
      }

      if (this.txtMeta == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa la meta del categoria.', confirmButtonText: 'Ok' });
        return;
      }

      let parametros = {
        "idLogin": localStorage.getItem("idLogin"),
        "nombre": this.txtNombre,
        "meta": this.txtMeta,
        "porcentaje": this.txtPorcentaje,
        "estado": "1"
      };
      this.categoriaHttpService.agregarCategoria(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        
        this.txtNombre = "";
        $('#modalCategoriaAgregar').modal('hide');
        this.toastr.success('Categoria creado correctamente')
        this.listaCategoriaByEstado()
      });
    }

    actualizarCategoriaById(){
      if (this.txtNombreEditar == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el nombre del categoria.', confirmButtonText: 'Ok' });
        return;
      }

      if (this.txtPorcentajeEditar == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el porcentaje del categoria.', confirmButtonText: 'Ok' });
        return;
      }

      if (this.txtMetaEditar == "") {
        Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa la meta del categoria.', confirmButtonText: 'Ok' });
        return;
      }

      let parametros = {
        idLogin: localStorage.getItem('idLogin'),
        nombre: this.txtNombreEditar,
        meta: this.txtMetaEditar,
        porcentaje: this.txtPorcentajeEditar,
        idCategoria: this.idCategoria,
      };
      this.categoriaHttpService.actualizarCategoriaById(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        
        this.txtNombre = "";
        $('#modalCategoriaEditar').modal('hide');
        this.toastr.success('Categoria actualizado correctamente');
        this.listaCategoriaByEstado()
      });
    }

    listaCategoriaByEstado(){
      let parametros = {
        "idLogin": localStorage.getItem("idLogin"),
        "estado": "1",
      };
      this.categoriaHttpService.listaCategoriaByEstado(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        this.listaCategoria = data;
      });
    }
}
