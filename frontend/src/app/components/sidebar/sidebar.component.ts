import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { UsuarioHttpService } from '../../client/usuario-http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  //VARIABLES LOCALES
  url: any = environment.url;
  foto: any;

  //LOCAL STORAGE
  idLogin: any;
  idUsuario: any;
  idRol:any = "";

  lblNombreUsuario: any = "";
  lblAppatUsuario: any = "";
  lblApmatUsuario: any = "";
  imagenUsuario: any;

  nombreNegocio: any;
  imagenNegocio: any;

  constructor(
    public router: Router,
    private alertaSwalService: AlertaSwalService,
    private usuarioHttpService: UsuarioHttpService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('idLogin') === null) {
      this.router.navigate(['/login', ]).then(() => {
        window.location.reload();
      });
    }

    this.usuarioLoginByIdLogin();
  }

  click_cerrarSesion(){
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: 'Esta seguro de cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c82333',
      cancelButtonColor: '#6e7881',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Cerrar!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/login']).then(() => {
          window.location.reload();
        });
      }
    });

  }

  usuarioLoginByIdLogin() {
    let parametros = {
      idLogin: localStorage.getItem('idLogin'),
    };
    this.usuarioHttpService
      .usuarioLoginByIdLogin(parametros)
      .subscribe((res) => {
        if (this.alertaSwalService.mostrarErrorHttp(res)) {
          return;
        }

        const body = res.body;
        let data = body.data;

        this.lblNombreUsuario = data['usuario']['nombreUsuario'];
        this.lblAppatUsuario = data['usuario']['appatUsuario'];
        this.lblApmatUsuario = data['usuario']['apmatUsuario'];
        this.idRol = data['usuario']['idRolUsuario']
      });
  }
}
