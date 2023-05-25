import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DatePipe} from "@angular/common";

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import { SolicitudesService } from '@modules/solicitudes/services/solicitudes.service';

export interface DialogData {
  IdSolicitud: number;  
}
export interface VerTiempoElement {
  actividad: number;
  valor: string;
}
export interface ParadaRelojElement {
  fechaParada: number;
  fechaReactivacion: number;
  parada: number;
}

const ELEMENT_DATA: VerTiempoElement[] = [];
const ELEMENT_DATA_PARADARELOJ: ParadaRelojElement[] = [];
@Component({
  selector: 'app-dialogo-vertiempo',
  templateUrl: './dialogo-vertiempo.component.html',
  styleUrls: ['./dialogo-vertiempo.component.css']
})
export class DialogoVerTiempoComponent implements OnInit {
  IdSolicitud:number=0;
  isLoading = false;
  step = 0;
  dataSourceGenerales = new MatTableDataSource<VerTiempoElement>(ELEMENT_DATA);
  dataSourceTiempoAtencion = new MatTableDataSource<VerTiempoElement>(ELEMENT_DATA);
  dataSourceParadaReloj = new MatTableDataSource<ParadaRelojElement>(ELEMENT_DATA_PARADARELOJ);

  @ViewChild('paginatorGenerales')paginator!: MatPaginator;
  displayedColumns: string[] = ['actividad','valor'];

  @ViewChild('paginatorTiempoAtencion')paginatorTiempoAtencion!: MatPaginator;
  displayedColumnsTiempoAtencion: string[] = ['actividad','valor'];


  @ViewChild('paginatorParadaReloj')paginatorParadaReloj!: MatPaginator;
  displayedColumnsParadaReloj: string[] = ['fechaParada','fechaReactivacion','parada'];


  constructor(
    private solicitudesService: SolicitudesService,
    private datePipe: DatePipe,
    public dialogo: MatDialogRef<DialogoVerTiempoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.IdSolicitud=  data.IdSolicitud;
  }
  setStep(index: number) {
    this.step = index;
  }
  ngAfterViewInit() {
    this.dataSourceGenerales.paginator = this.paginator;
    this.dataSourceTiempoAtencion.paginator = this.paginatorTiempoAtencion;
    this.dataSourceParadaReloj.paginator = this.paginatorParadaReloj;
  }
  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }

  confirmado(): void {
    this.dialogo.close({
      respuesta: true,
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.solicitudesService.getTiempos(this.IdSolicitud).then((respuesta) => {
           
        this.dataSourceGenerales.data=  respuesta.listGeneral;
        this.dataSourceTiempoAtencion.data=  respuesta.listAtencion;
        this.dataSourceParadaReloj.data=  respuesta.listParadas;
        this.isLoading = false;    
      });
  }
}
