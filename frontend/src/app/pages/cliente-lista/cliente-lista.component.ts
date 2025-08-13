import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { ClienteHttpService } from '../../client/cliente-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css']
})
export class ClienteListaComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(DataTableDirective, {static: false})

  dtElement:any = DataTableDirective;
  dtOptions: any = {}
  dtTrigger: Subject<any> = new Subject<any>();

  idCliente:any = ""
  txtCodigo:any = "";
  txtCi:any = "";
  txtComplemento:any = "";
  cboxTipo:any = "";
  txtNombre:any = "";
  txtAppat:any = "";
  txtApmat:any = "";
  txtFechaNac:any = "";
  cboxGenero:any = "";
  txtCelular:any = "";
  txtEmail:any = "";

  txtCodigoEditar:any = "";
  txtCiEditar:any = "";
  txtComplementoEditar:any = "";
  cboxTipoEditar:any = "";
  txtNombreEditar:any = "";
  txtAppatEditar:any = "";
  txtApmatEditar:any = "";
  txtFechaNacEditar:any = "";
  cboxGeneroEditar:any = "";
  txtCelularEditar:any = "";
  txtEmailEditar:any = "";

  listaClientes:any = []

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private alertaSwalService: AlertaSwalService,
    private clienteHttpService: ClienteHttpService,
  ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalClienteAgregar').hasClass('show')) {
      $('#modalClienteAgregar').modal('hide');
    }
  }

  ngOnInit(): void {
    $('#modalClienteAgregar').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });

    setTimeout(()=>{
      this.listaClientesByEstado()
    }, 200);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(environment.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  click_ventas(element:any){
    this.router.navigate(['cliente', element.idCliente, 'venta', "cliente"]).then(() => {
      //window.location.reload();
    });
  }

  click_actualizarCliente(element:any){
    this.idCliente = element.idCliente;
    let arrayFecNac = element["fechaNacimiento"].split("/");
    let fecNac = arrayFecNac[2] + "-" + arrayFecNac[1] + "-" + arrayFecNac[0];

    this.txtCodigoEditar = element.codigo
    this.txtCiEditar = element.ci
    this.txtComplementoEditar = element.complemento
    this.cboxTipoEditar = element.tipo
    this.txtNombreEditar = element.nombre
    this.txtAppatEditar = element.appat
    this.txtApmatEditar = element.apmat
    this.txtFechaNacEditar = fecNac
    this.cboxGeneroEditar = element.genero
    this.txtCelularEditar = element.celular
    this.txtEmailEditar = element.email
    $('#modalClienteEditar').modal('show');
  }

  click_cliente(element:any){
      this.router.navigate(['cliente', element.idCliente]).then(() => {
        //window.location.reload();
      });
    }

  click_agregarCliente(){
    $('#modalClienteAgregar').modal('show');
  }

  click_editarCliente(element:any){

  }

  agregarCliente(){
    if (this.cboxTipo == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Seleccione el Tipo de Cliente, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtCi == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca el número de carnet de identidad, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtNombre == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca el nombre, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtApmat == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca el apellido materno, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.cboxGenero == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Seleccione el Genero, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtFechaNac == "") {
      this.txtFechaNac = '2000-01-01';  
    }
    
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
      codigo: this.txtCodigo,
      ci: this.txtCi,
      complemento: this.txtComplemento,
      tipo: this.cboxTipo,
      nombre: this.txtNombre,
      appat: this.txtAppat,
      apmat: this.txtApmat,
      fechaNacimiento: this.txtFechaNac,
      genero: this.cboxGenero,
      celular: this.txtCelular,
      email: this.txtEmail,
      usuario: '',
      password: '',
    };
    this.clienteHttpService.agregarCliente(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      
      this.txtNombre = "";
      $('#modalClienteAgregar').modal('hide');
      this.toastr.success('Cliente registrado correctamente')
      this.listaClientesByEstado()
    });
  }

  actualizarClienteById(){
    if (this.cboxTipoEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Seleccione el Tipo de Cliente, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtCiEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca el número de carnet de identidad, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtNombreEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca el nombre, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtApmatEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca el apellido materno, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtFechaNacEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca la fecha de nacimiento, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.cboxGeneroEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Seleccione el Genero, por favor.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtCelularEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca el numero de celular, por favor.', confirmButtonText: 'Ok' });
      return;
    }
    
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idCliente": this.idCliente,
      "codigo": this.txtCodigoEditar,
      "ci": this.txtCiEditar,
      "complemento": this.txtComplementoEditar,
      "tipo": this.cboxTipoEditar,
      "nombre": this.txtNombreEditar,
      "appat": this.txtAppatEditar,
      "apmat": this.txtApmatEditar,
      "fechaNacimiento": this.txtFechaNacEditar,
      "genero": this.cboxGeneroEditar,
      "celular": this.txtCelularEditar,
      "email": this.txtEmailEditar,
    };
    this.clienteHttpService.actualizarClienteById(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      
      this.txtNombre = "";
      $('#modalClienteEditar').modal('hide');
      this.toastr.success('Cliente actualizado correctamente')
      this.listaClientesByEstado()
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

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(environment.dtOptions);
      });

    });
  }

}
