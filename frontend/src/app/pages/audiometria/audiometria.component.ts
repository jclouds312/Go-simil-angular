import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { PDFDocument, rgb } from 'pdf-lib';

Chart.register(...registerables);

@Component({
  selector: 'app-audiometria',
  templateUrl: './audiometria.component.html',
  styleUrls: ['./audiometria.component.css']
})
export class AudiometriaComponent {}