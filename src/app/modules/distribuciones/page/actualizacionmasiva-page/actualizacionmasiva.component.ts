import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { DistribucionesService } from '../../services/distribuciones.service';
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../../../core/auth/auth.service";
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { ClienteService } from '@shared/services/cliente.service';

@Component({
  selector: 'app-actualizacionmasiva-page',
  templateUrl: './actualizacionmasiva.component.html',
  styleUrls: ['./actualizacionmasiva.component.css']  
})
export class ActualizacionMasivaComponent implements OnInit, OnDestroy {
  progressRef!: NgProgressRef;
  clienteMaster: number = 0;
  value: number = 0;
  mode = new UntypedFormControl('side');
  isLoading = false;
  isSubmitted: boolean = false;
  matexpansionpaneldatosgenerales: boolean = false;  
  public itemsPerPage: number = 10;
  public totalRegistros: number = 0;
  public currentPage: number = 0;    
  files: any[] = [];
  allFiles: File[] = [];
  datosEdi: any = {};  
  public dataSource: any;  
  isShowing: boolean = false; 
  displayedColumns: string[] =
  [
    'CodigoSolicitud',
    'TipoServicio',    
    'Solicitante',
    'Prioridad',    
    'FRegistro'    
  ];  
  constructor(
    public clienteService: ClienteService,
    public router: Router,
    private ngProgress: NgProgress,
    private _authService: AuthService,
    private route: ActivatedRoute,
    public dialogo: MatDialog,
    private distribucionesService: DistribucionesService,    
    private bootstrapNotifyBarService: BootstrapNotifyBarService,    
  ) {
    /*Cada vez que existe un cambio  en el objeto cartEvent se suscribira para que realizo un accion */
    clienteService.cartEvent$.subscribe((value) => {
      console.log(value);
      this.clienteMaster = value.Id;
      /*this.cookieService.delete('objetoClientePorUsuario');
      this.cookieService.set('objetoClientePorUsuario', JSON.stringify(value));*/
      this.ngOnInit();
    });
  }

  
  
  ngOnDestroy(): void {
    this.ngProgress.destroyAll();
  }

  async ngOnInit() {

    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.progressRef = this.ngProgress.ref();
    this.progressRef.state.subscribe((state: any) => {
      this.value = state.value;
    });
    this.loadDatos();
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
  async btnActualizarTickets(){
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
    this.distribucionesService.subirPlantillaActualizacionOE(request).then((res: any) => {
      if (res.TipoResultado === 1) {
        this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
        // this.dialogo.close({
        //   respuesta: true
        // });        
      } else {
        this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
      }
      this.progressRef.complete();
    });

  }

  loadDatos(): void {  
    var request = {
      d: {
        datatable: {
          IdCliente: 62,
          IdSolicitante:this.datosEdi.Id,
        },
        draw: 1,
        length: this.itemsPerPage,
        start: this.currentPage
      }    
    }
    this.isLoading = true;
    this.dataSource = [];    
    this.distribucionesService.ListarPaginado(request).then((res) => {
      this.isLoading = false;
      this.dataSource = res.data;
      this.totalRegistros = res.recordsTotal;
    });
  }
  pageChanged(event: any): void {
    
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.loadDatos();
  };
  

  btnDescargarExcel(){

  }
  
  //#endregion
}
