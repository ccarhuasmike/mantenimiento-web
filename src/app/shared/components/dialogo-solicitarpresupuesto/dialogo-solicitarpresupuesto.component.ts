import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from "@core/auth/auth.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ProveedorService } from "@shared/services/proveedor.service";
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { eLista } from "@core/types/formatos.types";
import { ListavaloresService } from "@shared/services/listavalores.service";
export interface ProveedorElement {
  Id: number;
  Nombre: string;
}
export interface ElaboradorElement {
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
  selector: 'app-dialogo-solicitarpresupuesto',
  templateUrl: './dialogo-solicitarpresupuesto.component.html',
  styleUrls: ['./dialogo-solicitarpresupuesto.component.css']
})
export class DialogoSolicitarPresupuestosComponent implements OnInit {
  @ViewChild('select') select!: MatSelect;
  mode = new UntypedFormControl('side');
  isLoading = false;
  IdsClientes: string = "";
  IdSolicitud: number = 0;
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEdi: any = {};
  ELEMENT_DATA_PROVEEDOR: ProveedorElement[] = [];
  filteredELEMENT_DATA_PROVEEDOR!: Observable<ProveedorElement[]>;
  ELEMENT_DATA_ELABORADOR: ElaboradorElement[] = [];
  filteredELEMENT_DATA_ELABORADOR!: Observable<ElaboradorElement[]>;
  proveedorCtrl = new UntypedFormControl('');
  elaboradorCtrl = new UntypedFormControl('');
  listMoneda: any = [];
  files: any[] = [];
  constructor(
    private clienteService: SolicitanteService,
    private listavaloresService: ListavaloresService,
    private proveedorService: ProveedorService,
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    public dialogo: MatDialogRef<DialogoSolicitarPresupuestosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initfilteredELEMENT_DATA_PROVEEDOR();
    this.initfilteredELEMENT_DATA_ELABORADOR();
    /*this.IdSolicitud = data.IdSolicitud;*/
    this.IdsClientes=data.IdsCliente.toString();
  }

  /*PROVEEDOR */
  private initfilteredELEMENT_DATA_PROVEEDOR() {
    this.filteredELEMENT_DATA_PROVEEDOR = this.proveedorCtrl.valueChanges.pipe(
      startWith(''),
      map(proveedor => {
        proveedor = (proveedor instanceof Object) ? proveedor : { Id: 0, Nombre: proveedor };
        return (proveedor ? this.filterStatesProveedor(proveedor) : this.ELEMENT_DATA_PROVEEDOR.slice())
      }),
    );
  }
  private filterStatesProveedor(value: ProveedorElement): ProveedorElement[] {
    const filterValue = value.Nombre.toLowerCase();
    return this.ELEMENT_DATA_PROVEEDOR.filter((state: any) => state.Nombre.toLowerCase().includes(filterValue));
  }
  displayFnNombreProveedor(user: ProveedorElement): string {
    return user && user.Nombre ? user.Nombre : '';
  }
  searchProveedor(): void {
    this.buscarProveedor("");
  }
  buscarProveedor(nombre: string): void {
    this.proveedorService.getProveedorFiltro({
      idcliente: this.IdsClientes,
      nombre: "",
    }).then((res: any) => {
      this.ELEMENT_DATA_PROVEEDOR = res;
      this.initfilteredELEMENT_DATA_PROVEEDOR();
    }, error => {
    });
  }
  /*ELABORADOR */
  private initfilteredELEMENT_DATA_ELABORADOR() {
    this.filteredELEMENT_DATA_ELABORADOR = this.elaboradorCtrl.valueChanges.pipe(
      startWith(''),
      map(elaborador => {
        elaborador = (elaborador instanceof Object) ? elaborador : { Id: 0, Nombre: elaborador };
        return (elaborador ? this.filterStatesElaborador(elaborador) : this.ELEMENT_DATA_ELABORADOR.slice());
      }),
    );
  }
  private filterStatesElaborador(value: ElaboradorElement): ElaboradorElement[] {
    const filterValue = value.Nombre.toLowerCase();
    return this.ELEMENT_DATA_ELABORADOR.filter((state: any) => state.Nombre.toLowerCase().includes(filterValue));
  }
  displayFnNombreElaborador(user: ElaboradorElement): string {
    return user && user.Nombre ? user.Nombre : '';
  }
  searchElaborador(): void {
    this.buscarElaborador("");
  }
  buscarElaborador(nombre: string): void {
    this.clienteService.getSolicitante({
      idcliente: this.IdsClientes,
      nombre: nombre//"ABDON VELASQUEZ VAQUERIZO"
    }).then((res: any) => {

      this.ELEMENT_DATA_ELABORADOR = res;
      this.initfilteredELEMENT_DATA_ELABORADOR();
    }, error => this.isLoading = false);
  }
  listarMoneda() {
    this.listavaloresService.getListaValores({
      idlista: eLista.TipoMoneda,
      idcliente: ""
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listMoneda = respuesta.ListaEntidadComun;
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
        //IdSolicitud
        IdElaborador: this.datosBasicosFormGroup.value.elaboradorCtrl.Id,
        monto: this.datosBasicosFormGroup.value.montoTotalCtrl,
        idMoneda: this.datosBasicosFormGroup.value.monedaCtrl,
        idProveedorRecomendado: this.datosBasicosFormGroup.value.proveedorCtrl.Id,
        indicaciones: this.datosBasicosFormGroup.value.indicacionesCtrl,
        listAdjuntoCloud :[]
      },
      requestFiles: this.files
    });
  }
  ngOnInit() {
    this.listarMoneda();
    this.buscarElaborador("");
    this.buscarProveedor("");
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      proveedorCtrl: this.proveedorCtrl,
      elaboradorCtrl: this.elaboradorCtrl,
      montoTotalCtrl: ['', Validators.required],
      monedaCtrl: ['', Validators.required],
      indicacionesCtrl: ['']
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
