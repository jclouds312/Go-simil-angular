import { AfterViewInit, Component, OnDestroy, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CuentaHttpService } from '../../client/cuenta-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from "ngx-toastr";
import { environment } from 'src/environments/environment';

declare var $:any;

@Component({
  selector: 'app-component-filtro-fecha',
  templateUrl: './component-filtro-fecha.component.html',
  styleUrls: ['./component-filtro-fecha.component.css']
})
export class ComponentFiltroFechaComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() eventOutput_buscar = new EventEmitter<any>();

  mesNombres:any = [
    'Enero', 'Febrero', 'Marzo', 'Abril',
    'Mayo', 'Junio', 'Julio', 'Agosto',
    'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  tipoFiltro:any = "gestionMes";
  tipoLiteral:any = "";
  anhoArray:any = [];
  anhoInicio:any = "2025";
  anhoSeleccionado:any = "";
  mesNombre:any = "";
  mesSeleccionado:any = "";
  diasMes:any = "";
  fechaInicio:any = "";
  fechaFin:any = "";


  

constructor(
    private paramGet: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    // ejemplo
    //const today = new Date(2024, 0, 1);

    const anhoActual = new Date().getFullYear();
    for (let anho = this.anhoInicio; anho <= anhoActual; anho++) {
      this.anhoArray.push(anho);
    }

    const today = new Date();
    this.anhoSeleccionado = today.getFullYear();
    this.mesSeleccionado = String(today.getMonth() + 1).padStart(2, '0');

    this.click_buscar();
  }

  ngOnDestroy(): void {}

  change_tipoFiltro(event: Event): void {
    const valorSeleccionado = (event.target as HTMLSelectElement).value;
    console.log('Filtro seleccionado:', valorSeleccionado);
    this.tipoFiltro = valorSeleccionado;
  }

  change_anho(event: Event): void {
    const valorSeleccionado = (event.target as HTMLSelectElement).value;
    console.log('anho seleccionado:', valorSeleccionado);

    this.anhoSeleccionado = valorSeleccionado;
  }

  change_mes(event: Event): void {
    const valorSeleccionado = (event.target as HTMLSelectElement).value;
    console.log('anho seleccionado:', valorSeleccionado);

    this.mesSeleccionado = valorSeleccionado;
  }

  click_buscar(): void {
    if(this.tipoFiltro == 'inicio'){
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
      const day = String(today.getDate()).padStart(2, '0');

      this.fechaInicio = `${this.anhoInicio}-01-01`
      this.fechaFin = `${year}-${month}-${day}`;
    }

    if(this.tipoFiltro == 'gestion'){
      this.fechaInicio = `${this.anhoSeleccionado}-01-01`
      this.fechaFin = `${this.anhoSeleccionado}-12-31`;
      this.tipoLiteral = `Gestión: ${this.anhoSeleccionado}`;
    }

    if(this.tipoFiltro == 'gestionMes'){
      this.mesNombre = this.mesNombres[parseInt(this.mesSeleccionado)-1];
      this.diasMes = new Date(this.anhoSeleccionado, this.mesSeleccionado, 0).getDate();

      this.fechaInicio = `${this.anhoSeleccionado}-${this.mesSeleccionado}-01`
      this.fechaFin = `${this.anhoSeleccionado}-${this.mesSeleccionado}-${this.diasMes}`;

      this.tipoLiteral = `Mes: ${this.mesNombre} - ${this.anhoSeleccionado}`;
    }

    if(this.tipoFiltro == 'fechas'){
      const [anioInicio, mesInicio, diaInicio] = this.fechaInicio.split('-');
      const [anioFin, mesFin, diaFin] = this.fechaFin.split('-');
      this.tipoLiteral = `Rago de Fechas: ${diaInicio}/${mesInicio}/${anioInicio} - ${diaFin}/${mesFin}/${anioFin}`;
    }

    let dataOutput = {
      "tipo": this.tipoFiltro,
      "tipoLiteral": this.tipoLiteral,
      "fechaInicio": this.fechaInicio,
      "fechaFin": this.fechaFin
    }
    this.eventOutput_buscar.emit(dataOutput);
  }
}
