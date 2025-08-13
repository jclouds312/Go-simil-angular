import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  idLicencia:any = "100";
  lblNombreLicencia:any = "";
  cantidadAnuncios:any = "";
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    if(!localStorage.getItem("idLogin")){
      this.router.navigate(['/login']).then(() => {
        window.location.reload();
      });
      return;
    }
  }

}
