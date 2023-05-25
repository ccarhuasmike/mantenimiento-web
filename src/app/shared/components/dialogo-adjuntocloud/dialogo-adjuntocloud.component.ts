import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {DatePipe} from "@angular/common";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {AdministracionService} from "@shared/services/administracion.service";
import {AzureService} from "@core/azure/azure.service";
import {DialogoConfirmacionComponent} from "@shared/components/dialogo-confirmacion/dialogo-confirmacion.component";
import {AdjuntoCloudElement} from "@core/models/administracion.model";

export interface DialogData {
  CodigoTabla: number;
  IdEntidad: number;
  NumerosGrupo: string;
}

const ELEMENT_DATA: AdjuntoCloudElement[] = [];

@Component({
  selector: 'app-dialogo-adjuntocloud',
  templateUrl: './dialogo-adjuntocloud.component.html',
  styleUrls: ['./dialogo-adjuntocloud.component.css']
})
export class DialogoAdjuntoCloudComponent implements OnInit {
  isLoading = false;
  dataSource = new MatTableDataSource<AdjuntoCloudElement>(ELEMENT_DATA);
  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = ['menu', 'NombreExterno', 'Tipo', 'NombreUsuario', 'FechaRegistro'];
  constructor(
    private administracionService: AdministracionService,
    private azureService: AzureService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    public dialogo: MatDialogRef<DialogoAdjuntoCloudComponent>,
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

  public deleteImage(row: any) {
    
    this.dialog.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      data: {
        titulo: `Mensaje de Confirmación`,
        mensaje: `¿Esta seguro que desea eliminar?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          this.azureService.deleteImage(row.NombreInterno, () => {
            this.administracionService.getEliminarAdjuntoCloud(row.Id.toString()).then((res: any) => {
              this.listarAdjuntoCloud();
            })
          })
        }
      });
  }

  public downloadImage(row: any) {
    this.azureService.downloadImagefile(row);
  }

  confirmado(): void {
    this.dialogo.close({
      respuesta: true,
    });
  }

  ngOnInit() {
    this.listarAdjuntoCloud();
  }

  listarAdjuntoCloud() {
    this.isLoading = true;
    this.administracionService.getListarArchivoAdjuntoCloud({
      CodigoTabla: this.data.CodigoTabla,
      IdEntidad: this.data.IdEntidad,
      NumerosGrupo: this.data.NumerosGrupo,
    }).then((respuesta) => {
      this.dataSource.data = respuesta;
      this.isLoading = false;
    }, error => this.isLoading = false);
  }
}
