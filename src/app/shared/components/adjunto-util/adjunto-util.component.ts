import { Component,OnInit, Input } from '@angular/core';
import { TmAdjunto } from '@core/models/TmAdjunto-interface';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { BootstrapNotifyBarService } from '@shared/services/bootstrap-notify.service';
import { ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { AssetService } from '@shared/services/asset.service';
import { AzureService } from '@core/azure/azure.service';
import { DialogoConfirmacionComponent } from '@shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { AdministracionService } from '@shared/services/administracion.service';
import { eEntidad } from '@core/types/formatos.types';
import { AuthService } from '@core/auth/auth.service';


@Component({
  selector: 'app-adjunto-util',
  templateUrl: './adjunto-util.component.html',
  styleUrls: ['./adjunto-util.component.css']
})
export class AdjuntoUtilComponent implements OnInit {
  @Input() idRegistro: number=0;
  @Input() CodigoTabla: number=0;  
  progressRef!: NgProgressRef;
  files: any[] = [];
  dsAdjunto: TmAdjunto[] = [];
  flagContenedorAdjunto: boolean = false;
  datosEdi: any = {};
  value: number = 0;
  @ViewChild(MatTable) table?: MatTable<TmAdjunto>;
  isLoading = false;
  constructor(private notificador: BootstrapNotifyBarService,
              private assetService: AssetService,
              private azureService: AzureService,
              private ngProgress: NgProgress,
              private administracionService: AdministracionService,
              public dialogo: MatDialog,
              private _authService: AuthService) { }

  ngOnInit(): void {
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.progressRef = this.ngProgress.ref();
    this.progressRef.state.subscribe((state: any) => {
      this.value = state.value;
    });
    if(this.idRegistro>0)
        this.listarAdjuntos();
  }
  listarAdjuntos(){    
    
    this.administracionService.getListarArchivoAdjuntoCloud({
        CodigoTabla: this.CodigoTabla,
        IdEntidad: this.idRegistro
    }).then((respuesta) => {
      console.log(respuesta);
      this.dsAdjunto = respuesta;
    });
  }
  
     //Adjuntos
async onSelect(event: any) {

if (event.addedFiles.length > 1) {
  this.notificador.notifyWarning("No se pueden agregar más de 1 archivos a la vez");
} else {
  this.progressRef.start();
  for (const file of event.addedFiles) {
    if (this.isFileSizeAllowed(file.size)) {
      if (this.files.length < 1) {
        event.addedFiles.forEach((x: any) => {
          x.progress = 0;

        });
        let adj: any = {
          NombreExterno : file.name ,
          Nombre: file.name,   
          Tamanio: file.size,
          UsuarioRegistro: this.datosEdi.Id,
          fxRegistro: new Date(),
          NombreExtension: "." + file.name.split(".").pop(),
          IdEntidad : this.idRegistro
        }
        adj.CodigoTabla=this.CodigoTabla;
        // if (this.idRegistro>0) {
        const blob = new Blob([file], { type: file.type });
        const response = await this.azureService.uploadFile(blob, file.name);
        adj.NombreInterno = response.uuidFileName;
        

        this.assetService.subirArchivoAzureIndividual(adj).subscribe((rsp: any) => {
          adj.idAdjunto = rsp.Id;
          let lsIdsAdjuntos =  JSON.parse(localStorage.getItem("tmpAdjunto_"+this.CodigoTabla)??"[]") ;

         
          lsIdsAdjuntos.push(adj.idAdjunto);

          localStorage.setItem("tmpAdjunto_"+this.CodigoTabla,JSON.stringify(lsIdsAdjuntos));
          this.dsAdjunto.push(adj);
          this.table?.renderRows();      
        }); 
        this.uploadFilesSimulator(0);
      } else {
        this.notificador.notifyWarning("Se permiten un máximo de 1 archivos.");
      }
    } else {
      this.notificador.notifyWarning("El tamaño máximo de un archivo permitido es de 2mb, los archivos con un tamaño superior a 2 mb se descartan.");
    }
  }
}        
}

onRemove(event: any) {
  this.files.splice(this.files.indexOf(event), 1);
}
isFileSizeAllowed(size: any) {
  let isFileSizeAllowed = false;
  if (size < 2000000) {
    isFileSizeAllowed = true;
  }
  return isFileSizeAllowed;
}
uploadFilesSimulator(index: number) {
  setTimeout(() => {
    if (index === this.files.length) {
      return;
    } else {
      const progressInterval = setInterval(() => {
        if (this.files[index].progress === 100) {
          clearInterval(progressInterval);
          this.uploadFilesSimulator(index + 1);
        } else {
          this.files[index].progress += 5;
        }
      }, 200);
    }
  }, 1000);
}
/**
/**
* format bytes
* @param bytes (File size in bytes)
* @param decimals (Decimals point)
*/
formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) {
    return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      return;
    }
    this.files.splice(index, 1);
}

btnAdjuntos_Click(){
// this.isLoadingAdjuntosGenerales = true;
this.flagContenedorAdjunto = false;


}
eliminarArchivo(record: TmAdjunto) {
  const ok = confirm('¿Está seguro de eliminar el archivo?');
  if (ok) {
    this.azureService.deleteImage(record.stNombreArchivoRuta||"", () => {
    this.administracionService.getElminarAdjunto({
      Id: record.idAdjunto,
      NombreInterno: record.stNombreArchivoRuta
    });
    const index = this.dsAdjunto.indexOf(record);
    if (index >= 0) {
      this.dsAdjunto.splice(index, 1);
      this.table?.renderRows();
    }
    })
    }
}

public downloadImage(row: any) {
this.azureService.downloadImagefile(row);
}
public deleteImageGenerales(row: any) {

this.dialogo.open(DialogoConfirmacionComponent, {
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
      this.azureService.deleteImage(row.stNombreArchivoRuta, () => {

        const index = this.dsAdjunto.indexOf(row);
        if (index >= 0) {
          this.dsAdjunto.splice(index, 1);
          this.table?.renderRows();
        }
        if (row.idAdjunto) {
          this.administracionService.getElminarAdjunto({
            Id: row.idAdjunto,
            NombreInterno: row.stNombreArchivoRuta
          });
        }
      })
    }
  });
}
}
