import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AlertaSwalService } from '../../client/alerta-swal.service';
import { SistemaHttpService } from '../../client/sistema-http.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  lblVersion:any = "";

  constructor(
    private alertaSwalService: AlertaSwalService,
    private sistemaHttpService: SistemaHttpService,
  ) { }

  ngOnInit(): void {
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
}
