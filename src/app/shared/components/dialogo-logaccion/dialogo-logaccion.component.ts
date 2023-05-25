import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DatePipe} from "@angular/common";
import {LogAccionService} from "@shared/services/logaccion.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

export interface DialogData {
  tabla: number;
  entidad: number;

}
export interface LogAccionElement {
  Indice: number;
  Descripcion: string;
  FechaRegistro: string;
  NombreUsuario: string;
}
const ELEMENT_DATA: LogAccionElement[] = [
];
@Component({
  selector: 'app-dialogo-logaccion',
  templateUrl: './dialogo-logaccion.component.html',
  styleUrls: ['./dialogo-logaccion.component.css']
})
export class DialogoLogAccionComponent implements OnInit {

  isLoading = false;
  dataSource = new MatTableDataSource<LogAccionElement>(ELEMENT_DATA);
  @ViewChild('paginator')paginator!: MatPaginator;
  displayedColumns: string[] = ['Indice','NombreUsuario' , 'FechaRegistro','Descripcion'];
  constructor(
    private logAccionService: LogAccionService,
    private datePipe: DatePipe,
    public dialogo: MatDialogRef<DialogoLogAccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
    this.logAccionService.getLogAcciones({
      tabla: this.data.tabla,
      entidad:this.data.entidad,
    }).then((res:any) => {

      this.dataSource.data=res;
      this.isLoading = false;
    }, error => this.isLoading = false);
  }
}
