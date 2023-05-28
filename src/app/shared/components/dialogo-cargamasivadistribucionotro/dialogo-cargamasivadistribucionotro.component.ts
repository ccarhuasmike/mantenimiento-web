import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from "@core/auth/auth.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { BootstrapNotifyBarService } from '@shared/services/bootstrap-notify.service';
import { DistribucionesService } from '@modules/distribuciones/services/distribuciones.service';
export interface DialogData {
  titulo: string;
  mensaje: string;
  IdsSolicitud: string;
  accion: number;
}

@Component({
  selector: 'app-dialogo-cargamasivadistribucionotro',
  templateUrl: './dialogo-cargamasivadistribucionotro.component.html',
  styleUrls: ['./dialogo-cargamasivadistribucionotro.component.css']
})
export class DialogoCargaMasivaDistribucionOtrosComponent implements OnInit {
  submitted = false;
  progressRef!: NgProgressRef;
  value: number = 0;
  files: any[] = [];  
  datosEdi: any = {};
  constructor(
    private ngProgress: NgProgress,
    private distribucionesService: DistribucionesService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    public dialogoConfir: MatDialog,
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService,
    public dialogo: MatDialogRef<DialogoCargaMasivaDistribucionOtrosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    //
  }
  isFileSizeAllowed(size: any) {
    let isFileSizeAllowed = false;
    if (size < 2000000) {
      isFileSizeAllowed = true;
    }
    return isFileSizeAllowed;
  }

  /**
 * handle file from browsing
 */
  // fileBrowseHandler(files) {
  //   this.prepareFilesList(files);
  // }
  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      return;
    }
    this.files.splice(index, 1);
  }


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

  /**
 * Simulate the upload process
 */
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

  convertir(file: any) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      var fileByteArray: any = [];
      reader.onloadend = function (evt: any) {
        if (evt.target.readyState == FileReader.DONE) {
          var arrayBuffer = evt.target.result,
            array = new Uint8Array(arrayBuffer);
          for (var i = 0; i < array.length; i++) {
            fileByteArray.push(array[i]);
          }
          resolve(fileByteArray);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  onSelect(event: any) {
    if (event.addedFiles.length > 1) {
      this.bootstrapNotifyBarService.notifyWarning("No se pueden agregar más de 1 archivos a la vez");
    } else {
      for (const file of event.addedFiles) {
        if (this.isFileSizeAllowed(file.size)) {

          if (this.files.length < 1) {
            event.addedFiles.forEach((x: any) => {
              x.progress = 0;
            });
            this.files.push(file);
            this.uploadFilesSimulator(0);

          } else {
            this.bootstrapNotifyBarService.notifyWarning("Se permiten un máximo de 1 archivos.");
          }
        } else {
          this.bootstrapNotifyBarService.notifyWarning("El tamaño máximo de un archivo permitido es de 2 mb, los archivos con un tamaño superior a 2 mb se descartan.");
        }
      }
    }
  }

  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }

  async confirmado() {
    this.submitted = true;    
    if (this.files.length == 0) {
      this.bootstrapNotifyBarService.notifyWarning("Por favor seleccione un archivo de carga");
      return;
    }
    this.progressRef.start();
    const base64 = await this.convertir(this.files[0]);
    const request = {
      archivo: {
        Nombre: this.files[0].name,
        arrArchivo: base64
      }
    }
    this.distribucionesService.subirPlantillaCargarMasivaDistribucion(request).then((res: any) => {
      if (res.TipoResultado === 1) {
        this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
        this.dialogo.close({
          respuesta: true
        });        
      } else {
        this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
      }
      this.progressRef.complete();
    });


    // this.dialogoConfir.open(DialogoConfirmacionComponent, {
    //   maxWidth: '25vw',
    //   maxHeight: 'auto',
    //   height: 'auto',
    //   width: '25%',
    //   disableClose: true,
    //   data: {
    //     titulo: `Mensaje de Confirmación`,
    //     mensaje: `¿Está seguro de anular las solicitudes seleccionadas?`
    //   }
    // })
    //   .afterClosed()
    //   .subscribe(async (confirmado: Boolean) => {
    //     if (confirmado) {
    //       this.dialogo.close({
    //         IdsSolicitud: this.data.IdsSolicitud,
    //         txtComentarioRechazo: this.datosBasicosFormGroup.controls["mytxtComentarioRechazo"].value,
    //         respuesta: true
    //       });
    //     }
    //   });
  }

  ngOnInit() {
    this.progressRef = this.ngProgress.ref();
    this.progressRef.state.subscribe((state: any) => {
      this.value = state.value;
    });
    this.datosEdi = JSON.parse(this._authService.accessEdi);    
  }
  ngOnDestroy(): void {
    this.ngProgress.destroyAll();
  }

}
