import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { UsuarioHttpService } from '../../client/usuario-http.service';
import { SucursalHttpService } from '../../client/sucursal-http.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment';

import { Subject } from 'rxjs';
declare var $:any;

@Component({
  selector: 'app-usuario-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.css']
})
export class UsuarioListaComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild(DataTableDirective, {static: false})

  dtElement:any = DataTableDirective;
  dtOptions: any = {}
  dtTrigger: Subject<any> = new Subject<any>();

  idUsuarioSucursal:any = "";
  idSucursalAgregar:any = "";
  idUsuario:any = ""
  txtCi:any = "";
  txtComplemento:any = "";
  txtNombre:any = "";
  txtAppat:any = "";
  txtApmat:any = "";
  txtFechaNac:any = "";
  cboxGenero:any = "";
  cboxRol:any = "";
  txtCelular:any = "";
  txtEmail:any = "";
  txtUsuario:any = "";
  txtPass:any = "";
  txtPassRepetir:any = "";

  txtCiEditar:any = "";
  txtComplementoEditar:any = "";
  txtNombreEditar:any = "";
  txtAppatEditar:any = "";
  txtApmatEditar:any = "";
  txtFechaNacEditar:any = "";
  cboxGeneroEditar:any = "";
  txtCelularEditar:any = "";
  txtEmailEditar:any = "";

  txtPassEditar:any = "";
  txtPassNuevo:any = "";
  txtPassNuevoRepetir:any = "";

  listaUsuarios:any = []
  listaSucursalesAgregar:any = []
  listaSucursales:any = []

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private alertaSwalService: AlertaSwalService,
    private usuarioHttpService: UsuarioHttpService,
    private sucursalHttpService: SucursalHttpService,
  ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    // Si el modal está abierto
    if ($('#modalUsuarioDatosAgregar').hasClass('show')) {
      $('#modalUsuarioDatosAgregar').modal('hide');
    }
  }
  
  ngOnInit(): void {
    $('#modalUsuarioDatosAgregar').on('shown.bs.modal', () => {
      history.pushState(null, '', window.location.href);
    });
    setTimeout(()=>{
      this.listaUsuariosByEstado()
    }, 200);
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(environment.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  click_agregarUsuario(){
    $('#modalUsuarioDatosAgregar').modal('show');
  }

  click_irComision(element:any){
    this.idUsuario = element["idUsuario"];
    this.router.navigate(['usuario/comision', this.idUsuario]).then(() => {
      //window.location.reload();
    });
  }

  click_agregarUsuarioPass(){
    if (this.txtCi == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el número de carnet de identidad.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtNombre == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el nombre.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtApmat == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el apellido materno.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtFechaNac == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa la fecha de nacimiento.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.cboxGenero == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, seleccione el genero.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtCelular == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, Introduzca el número de celular.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.cboxRol == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, seleccione el rol de accesos.', confirmButtonText: 'Ok' });
      return;
    }

    $('#modalUsuarioDatosAgregar').modal('hide');
    $('#modalUsuarioPassAgregar').modal('show');
  }

  click_actualizarUsuario(element:any){
    let arrayFecNac = element["fechaNacimiento"].split("/");
    let fecNac = arrayFecNac[2] + "-" + arrayFecNac[1] + "-" + arrayFecNac[0];

    this.idUsuario = element["idUsuario"];
    this.txtNombreEditar = element["nombre"];
    this.txtAppatEditar = element["appat"];
    this.txtApmatEditar = element["apmat"];
    this.txtCiEditar = element["ci"];
    this.txtComplementoEditar = element["complemento"];
    this.txtFechaNacEditar = fecNac;
    this.cboxGeneroEditar = element["genero"];
    this.txtCelularEditar = element["celular"];
    this.txtEmailEditar = element["email"];

    $('#modalUsuarioEditar').modal('show');
  }

  click_actualizarPass(element:any){
    this.idUsuario = element["idUsuario"];
    $('#modalUsuarioPassEditar').modal('show');
  }

  click_deshabilitarUsuario(element:any){
    this.idUsuario = element["idUsuario"];

    Swal.fire({
            title: '¿Deshabilitar Usuario?',
            text: "Estas a punto de deshabilitar el usuario "+ element["nombre"],
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#c82333',
            cancelButtonColor: '#6e7881',
            cancelButtonText: "Cancelar",
            confirmButtonText: 'Deshabilitar!',
          }).then((result) => {
            if (result.isConfirmed) {
              let parametros = {
                "idLogin": localStorage.getItem("idLogin"),
                "idUsuario": this.idUsuario,
                "estado": '0'
              };
              this.usuarioHttpService.actualizarEstadoById(parametros).subscribe(res => {
                if (this.alertaSwalService.mostrarErrorHttp(res)){
                  return
                }
          
                const body = res.body;
                let data = body.data
    
                this.toastr.success('Usuario deshabilitado correctamente')
                this.listaUsuariosByEstado()
              });
            }
          })
  }

  click_listaSucursal(element:any){
    this.idUsuario = element["idUsuario"];
    this.listaSucursalByUsuario();

    $('#modalSucursal').modal('show');
  }

  click_agregarSucursal(element:any){
    this.idUsuario = element["idUsuario"];
    this.listaSucursalByEstado();

    $('#modalSucursalAgregar').modal('show');
  }

  agregarUsuario(){
        if (this.txtUsuario == "") {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca el usuario, por favor.', confirmButtonText: 'Ok' });
          return;
        }

        if (this.txtPass == "") {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca su contraseña, por favor.', confirmButtonText: 'Ok' });
          return;
        }

        if (this.txtPassRepetir == "") {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca su contraseña, por favor.', confirmButtonText: 'Ok' });
          return;
        }

        if (this.txtPass != this.txtPassRepetir) {
          this.txtPassRepetir = "";
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Su contraseña no coincide, verifique e intente nuevamente', confirmButtonText: 'Ok' });
          return;
        }
  
        let parametros = {
          "idLogin": localStorage.getItem("idLogin"),
          "ci": this.txtCi,
          "complemento": this.txtComplemento,
          "nombre": this.txtNombre,
          "appat": this.txtAppat,
          "apmat": this.txtApmat,
          "fechaNacimiento": this.txtFechaNac,
          "genero": this.cboxGenero,
          "celular": this.txtCelular,
          "email": this.txtEmail,
          "usuario": this.txtUsuario,
          "password": this.txtPass,
          "idRol": this.cboxRol
        };
        this.usuarioHttpService.agregarUsuario(parametros).subscribe(res => {
          if (this.alertaSwalService.mostrarErrorHttp(res)){
            return
          }
    
          const body = res.body;
          let data = body.data
          
          this.txtNombre = "";
          $('#modalUsuarioDatosAgregar').modal('hide');
          $('#modalUsuarioPassAgregar').modal('hide');
          this.toastr.success('Usuario creado correctamente')
          this.listaUsuariosByEstado()
        });
      }
  
      actualizarPasswordById(){
        if (this.txtPassEditar == "") {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca su contraseña, por favor.', confirmButtonText: 'Ok' });
          return;
        }

        if (this.txtPassNuevo == "") {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca la nueva contraseña, por favor.', confirmButtonText: 'Ok' });
          return;
        }

        if (this.txtPassNuevoRepetir == "") {
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Introduzca la nueva contraseña, por favor.', confirmButtonText: 'Ok' });
          return;
        }

        if (this.txtPassNuevo != this.txtPassNuevoRepetir) {
          this.txtPassRepetir = "";
          Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Su contraseña no coincide, verifique e intente nuevamente', confirmButtonText: 'Ok' });
          return;
        }
  
        let parametros = {
          "idLogin": localStorage.getItem("idLogin"),
          "idUsuario": this.idUsuario,
          "password": this.txtPassEditar,
          "passwordNuevo": this.txtPassNuevo
        };
        this.usuarioHttpService.actualizarPasswordById(parametros).subscribe(res => {
          if (this.alertaSwalService.mostrarErrorHttp(res)){
            return
          }
    
          const body = res.body;
          let data = body.data
          
          this.txtPassEditar = "";
          this.txtPassNuevo = "";
          this.txtPassNuevoRepetir = "";

          $('#modalUsuarioPassEditar').modal('hide');
          this.toastr.success('Contraseña actualizado correctamente')
          this.listaUsuariosByEstado()
        });
      }

      actualizarUsuarioById(){
        if (this.txtCiEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el número de carnet de identidad.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtNombreEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el nombre.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtApmatEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa el apellido materno.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtFechaNacEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, ingresa la fecha de nacimiento.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.cboxGeneroEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, seleccione el genero.', confirmButtonText: 'Ok' });
      return;
    }

    if (this.txtCelularEditar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, Introduzca el número de celular.', confirmButtonText: 'Ok' });
      return;
    }
  
        let parametros = {
          "idLogin": localStorage.getItem("idLogin"),
          "idUsuario": this.idUsuario,
          "ci": this.txtCiEditar,
          "complemento": this.txtComplementoEditar,
          "nombre": this.txtNombreEditar,
          "appat": this.txtAppatEditar,
          "apmat": this.txtApmatEditar,
          "fechaNacimiento": this.txtFechaNacEditar,
          "genero": this.cboxGeneroEditar,
          "celular": this.txtCelularEditar,
          "email": this.txtEmailEditar
        };
        this.usuarioHttpService.actualizarUsuarioById(parametros).subscribe(res => {
          if (this.alertaSwalService.mostrarErrorHttp(res)){
            return
          }
    
          const body = res.body;
          let data = body.data
          
          $('#modalUsuarioEditar').modal('hide');
          this.toastr.success('Usuario actualizado correctamente')
          
          this.listaUsuariosByEstado()
        });
      }

  actualizarSucursalEstadoById(element:any){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idUsuarioSucursal": element.idUsuarioSucursal,
      "estado": "0"
    };
    this.usuarioHttpService.actualizarSucursalEstadoById(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data

      this.toastr.success('Acceso a sucursal retirado correctamente')
      this.listaSucursalByUsuario();
    });
  } 

  agregarUsuarioSucursal(){
    if (this.idSucursalAgregar == "") {
      Swal.fire({ icon: 'warning', title: 'Error de Texto', text: 'Por favor, Seleccione una sucursal para agregar el acceso.', confirmButtonText: 'Ok' });
      return;
    }

    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "idUsuario": this.idUsuario,
      "idSucursal": this.idSucursalAgregar
    };
    this.usuarioHttpService.agregarUsuarioSucursal(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaSucursalesAgregar = data;

      $('#modalSucursalAgregar').modal('hide');
          this.toastr.success('Acceso a sucursal agregado correctamente')
    });
  } 

  listaUsuariosByEstado(){
    let parametros = {
      "idLogin": localStorage.getItem("idLogin"),
      "estado": "1",
    };
    this.usuarioHttpService.listaUsuariosByEstado(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
      this.listaUsuarios = data;

      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next(environment.dtOptions);
        });
    });
  }

  listaSucursalByUsuario(){
      let parametros = {
        "idLogin": localStorage.getItem("idLogin"),
        "idUsuario": this.idUsuario,
        "estado": "1",
      };
      this.usuarioHttpService.listaSucursalByUsuario(parametros).subscribe(res => {
        if (this.alertaSwalService.mostrarErrorHttp(res)){
          return
        }
  
        const body = res.body;
        let data = body.data
        this.listaSucursales = data;
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
      this.listaSucursalesAgregar = data;
    });
  }
}
