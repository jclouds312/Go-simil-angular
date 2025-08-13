import { Component, ViewChild, OnInit } from '@angular/core';
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { UsuarioHttpService } from '../../client/usuario-http.service';
import { SistemaHttpService } from '../../client/sistema-http.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  txtUsuario:any = "";
  txtPassword:any = "";
  lblVersion:any = "";

  constructor(
    private alertaSwalService: AlertaSwalService,
    private toastr: ToastrService,
    private router: Router,
    private sistemaHttpService: SistemaHttpService,
    private usuarioHttpService: UsuarioHttpService
  ) {}

  ngOnInit(): void {
    if(localStorage.getItem("idLogin")){
      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    }

    let parametros = {
      "idLogin": '1'
    };
    this.sistemaHttpService.version(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
    
      this.lblVersion = data["version"]
    });
  }

  click_login(){
    if(this.txtUsuario == "")
      {
        Swal.fire({ icon: 'warning', title: '', text: 'Por favor, ingresa tu usuario e inténtalo de nuevo.', confirmButtonText: 'Ok' });
        return;
      }

    if(this.txtPassword == "")
      {
        Swal.fire({ icon: 'warning', title: '', text: 'Por favor, ingresa tu contraseña e inténtalo de nuevo.', confirmButtonText: 'Ok' });
        return;
      }
      
    let parametros = {
      "idLogin": "1",
      "usuario": this.txtUsuario,
      "password": this.txtPassword
    }
    this.usuarioByUsuarioPassword(parametros);
  }

  usuarioByUsuarioPassword(parametros:any){
    this.usuarioHttpService.usuarioByUsuarioPassword(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data

      localStorage.setItem("idLogin", data["idLogin"])
      localStorage.setItem("idRol", data["idRol"])

      let param = {
        "idLogin": localStorage.getItem("idLogin"),
      }
      this.usuarioLoginByIdLogin(param);
    });
  }

  usuarioLoginByIdLogin(parametros:any){
    this.usuarioHttpService.usuarioLoginByIdLogin(parametros).subscribe(res => {
      if (this.alertaSwalService.mostrarErrorHttp(res)){
        return
      }

      const body = res.body;
      let data = body.data
    
      this.toastr.success('Bienvenido al Sistema')

      this.router.navigate(['/']).then(() => {
        window.location.reload();
      });
    });
  }
}
