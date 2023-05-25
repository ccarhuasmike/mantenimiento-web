import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { eLista } from "@core/types/formatos.types";
import { ListavaloresService } from "@shared/services/listavalores.service";
import { TecnicoService } from "@shared/services/tecnico.service";

export interface TecnicoElement {
  Id: number;
  Nombre: string;
}
import { SolicitanteService } from "@shared/services/solicitante.service";
import {BootstrapNotifyBarService} from "@shared/services/bootstrap-notify.service";
export interface DialogData {
  titulo: string;
  mensaje: string;
  IdsSolicitud: string;
  accion: number;
}
@Component({
  selector: 'app-dialogo-reportetecnico',
  templateUrl: './dialogo-reportetecnico.component.html',
  styleUrls: ['./dialogo-reportetecnico.component.css']
})
export class DialogoReporteTecnicoComponent implements OnInit {
  @ViewChild('select') select!: MatSelect;
  isLoading = false;
  IdsClientes: string = "";
  IdsProveedor: string = "";
  IdSolicitud: number = 0;
  datosBasicosFormGroup!: UntypedFormGroup;

  ELEMENT_DATA_TECNICO: TecnicoElement[] = [];
  filteredELEMENT_DATA_TECNICO!: Observable<TecnicoElement[]>;
  proveedorCtrl = new UntypedFormControl('');
  tecnicoCtrl = new UntypedFormControl('');
  listTipoAveria: any = [];
  listTipoSolucion: any = [];
  files: any[] = [];
  constructor(
    private tecnicoService: TecnicoService,
    private listavaloresService: ListavaloresService, 
    private _formBuilder: UntypedFormBuilder,
    public dialogo: MatDialogRef<DialogoReporteTecnicoComponent>,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.initfilteredELEMENT_DATA_TECNICO();
    this.IdSolicitud = data.IdsSolicitud.toString();
    this.IdsClientes = data.IdsCliente.toString();
    this.IdsProveedor = data.IdsProveedor.toString();

  }
  /*TECNICO */
  private initfilteredELEMENT_DATA_TECNICO() {
    this.filteredELEMENT_DATA_TECNICO = this.tecnicoCtrl.valueChanges.pipe(
      startWith(''),
      map(tecnico => {
        tecnico = (tecnico instanceof Object) ? tecnico : { Id: 0, Nombre: tecnico };
        return (tecnico ? this.filterStatesElaborador(tecnico) : this.ELEMENT_DATA_TECNICO.slice());
      }),
    );
  }
  private filterStatesElaborador(value: TecnicoElement): TecnicoElement[] {
    const filterValue = value.Nombre.toLowerCase();
    return this.ELEMENT_DATA_TECNICO.filter((state: any) => state.Nombre.toLowerCase().includes(filterValue));
  }
  displayFnNombreTecnico(user: TecnicoElement): string {
    return user && user.Nombre ? user.Nombre : '';
  }
  searchTecnico(): void {
    this.buscarTecnico("");
  }
  buscarTecnico(nombre: string): void {

    this.tecnicoService.getTecnicos({
      IdsCliente: this.IdsClientes,
      IdsProveedor: this.IdsProveedor,
    }).then((res: any) => {
      if (res.TipoResultado == 1) {
        this.ELEMENT_DATA_TECNICO = res.ListaUsuarios;
        this.initfilteredELEMENT_DATA_TECNICO();
      } else {
        this.ELEMENT_DATA_TECNICO = [];
      }
    }, error => this.isLoading = false);
  }
  listarTipoAveria() {
    this.listavaloresService.getListaValores({
      idlista: eLista.TipoAveria,
      idcliente: ""
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listTipoAveria = respuesta.ListaEntidadComun;
      }
    });
  }

  listarTipoSolucion() {
    this.listavaloresService.getListaValores({
      idlista: eLista.TipoSolucion,
      idcliente: null
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listTipoSolucion = respuesta.ListaEntidadComun;
      }
    });
  }
  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }
  confirmado(): void {
    if (!this.datosBasicosFormGroup.valid)
      return;
    
    this.dialogo.close({
      respuesta: true,
      request: {
        IdSolicitud : this.IdSolicitud,
        reporteTecnico : {
          IdTecnicoInforme: this.datosBasicosFormGroup.value.tecnicoCtrl.Id,
          IdTipoAveria: this.datosBasicosFormGroup.value.tipoAveriaCtrl,
          IdTipoSolucion: this.datosBasicosFormGroup.value.tipoSolucionCtrl,
          DescripcionSolucion: this.datosBasicosFormGroup.value.descripcionDetalladaCtrl,
          listAdjuntos :[]
        }
      },
      requestFiles: this.files
    });
  }
  ngOnInit() {
    this.listarTipoAveria();
    this.listarTipoSolucion();
    this.buscarTecnico("");
    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      tecnicoCtrl: this.tecnicoCtrl,
      tipoAveriaCtrl: ['', Validators.required],
      tipoSolucionCtrl: ['', Validators.required],
      descripcionDetalladaCtrl: ['', Validators.required],
    });
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
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
  isFileSizeAllowed(size: any) {
    let isFileSizeAllowed = false;
    if (size < 2000000) {
      isFileSizeAllowed = true;
    }
    return isFileSizeAllowed;
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
  onSelect(event: any) {
    if (event.addedFiles.length > 10) {
      this.bootstrapNotifyBarService.notifyWarning("No se pueden agregar más de 10 archivos a la vez");
    } else {
      for (const file of event.addedFiles) {
        if (this.isFileSizeAllowed(file.size)) {

          if (this.files.length < 10) {
            event.addedFiles.forEach((x: any) => {
              x.progress = 0;
            });
            this.files.push(file);
            this.uploadFilesSimulator(0);

          } else {
            this.bootstrapNotifyBarService.notifyWarning("Se permiten un máximo de 10 archivos.");
            //this.toastr.error("Maximum 6 files are allowed.");
          }
        } else {
          this.bootstrapNotifyBarService.notifyWarning("El tamaño máximo de un archivo permitido es de 2 mb, los archivos con un tamaño superior a 2 mb se descartan.");
          //this.toastr.error("Max size of a file allowed is 1mb, files with size more than 1mb are discarded.");
        }
      }
    }
  }

}
