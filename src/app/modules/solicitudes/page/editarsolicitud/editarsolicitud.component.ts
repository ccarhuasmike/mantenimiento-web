import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@core/auth/auth.service";
import { SolicitudesService } from "@modules/solicitudes/services/solicitudes.service";
import { DatePipe } from '@angular/common';
import { MatCheckboxChange } from "@angular/material/checkbox";
import {
  eAccionPendientes,
  eEntidad,
  eTipoFlujoSolicitud,
  EtipobandejaFacturacion
} from "@core/types/formatos.types";
import { DialogoConfirmacionComponent } from "@shared/components/dialogo-confirmacion/dialogo-confirmacion.component";
import { MatDialog } from "@angular/material/dialog";
import {
  DialogoRechazarSolicutdComponent
} from "@shared/components/dialogo-rechazarsolicitud/dialogo-rechazarsolicitud.component";

import {
  SolicitarAprobacionPresupuesto,
  SolicitudEnviarProveeedor,
  SolicitudReporteTecnico
} from "@core/models/solicitud.models";
import {
  DialogoLogAccionComponent
} from "@shared/components/dialogo-logaccion/dialogo-logaccion.component";
import { DialogoRegFechaComponent } from "@shared/components/dialogo-regfecha/dialogo-regfecha.component";
import { AdministracionService } from "@shared/services/administracion.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { SelectionModel } from "@angular/cdk/collections";
import { NgProgress, NgProgressRef } from "@ngx-progressbar/core";
import { UtilsService } from "@shared/services/utils.service";
import { AzureService } from "@core/azure/azure.service";
import { AdjuntoCloudElement } from "@core/models/administracion.model";
import { UntypedFormControl } from "@angular/forms";
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import {
  DialogoEnviarProveedorSolicutdComponent
} from "@shared/components/dialogo-enviarproveedor-solicitud/dialogo-enviarproveedor-solicitud.component";
import {
  DialogoSolicitarPresupuestosComponent
} from "@shared/components/dialogo-solicitarpresupuesto/dialogo-solicitarpresupuesto.component";
import {
  DialogoReporteTecnicoComponent
} from '@shared/components/dialogo-reportetecnico/dialogo-reportetecnico.component';
import { DialogoParadaRelojComponent } from "@shared/components/dialogo-paradareloj/dialogo-paradareloj.component";
import { DialogoEncuestaComponent } from "@shared/components/dialogo-encuesta/dialogo-encuesta.component";
import { DialogoTarifarioServicioComponent } from '@shared/components/dialogo-tarifarioservicio/dialogo-tarifarioservicio.component';
import { DialogoTarifarioMaterialesComponent } from '@shared/components/dialogo-tarifariomateriales/dialogo-tarifariomateriales.component';
import { DialogoTiempoatencionComponent } from '@shared/components/dialogo-tiempoatencion/dialogo-tiempoatencion.component';
import { DialogoVerTiempoComponent } from '@shared/components/dialogo-vertiempo/dialogo-vertiempo.component';
import { DialogoTarifarioDelServicioComponent } from '@shared/components/dialogo-tarifariodelservicio/dialogo-tarifariodelservicio.component';
import { DialogoTarifarioDeMaterialesComponent } from '@shared/components/dialogo-tarifariodelmateriales/dialogo-tarifariodelmateriales.component';
import { DialogoServicioPrecarioComponent } from '@shared/components/dialogo-servicioprecario/dialogo-servicioprecario.component';
import { asEnumerable } from 'linq-es2015';
import { DialogoAnularSolicitudComponent } from '@shared/components/dialogo-anularsolicitud/dialogo-anularsolicitud.component';

export interface AdjuntoPrespuestoElement {
  NombreInterno?: string;
  NombreExterno?: string;
  NombreExtension?: string;
  NombreUsuario?: string;
  FechaRegistro?: string;
  Id?: number;
}

export interface AdjuntorReporteTecnicoElement {
  NombreInterno?: string;
  NombreExterno?: string;
  NombreExtension?: string;
  NombreUsuario?: string;
  FechaRegistro?: string;
  Id?: number;
}

const ELEMENT_DATAADJUNTOREPORTETECNICO: AdjuntorReporteTecnicoElement[] = [];
const ELEMENT_ADJUNTO_PRESUPUESTO: AdjuntoPrespuestoElement[] = [];

export interface TarifadosServicioElement {
  Codigo?: string;
  NombreItem?: string;
  NombreUnidadMedida?: string;
  NombreMoneda?: string;
  PrecioUnitario?: string;
  Cantidad?: number;
  MontoTotal?: number;
}

const ELEMENT_TARIFADOS_SERVICIO: TarifadosServicioElement[] = [];

export interface TarifadosMaterialesElement {
  Codigo?: string;
  NombreItem?: string;
  NombreUnidadMedida?: string;
  NombreMoneda?: string;
  PrecioUnitario?: string;
  Cantidad?: number;
  MontoTotal?: number;
}

const ELEMENT_TARIFADOS_MATERIALES: TarifadosMaterialesElement[] = [];

export interface GastosMaterialesElement {
  NombreItem?: string;
  Cantidad?: number;
  NombreUnidadMedida?: string;
  NombreMoneda?: string;
  PrecioUnitario?: number;
  MontoTotal?: number;
  Documento: string;
  Descripcion?: string;
}

const ELEMENT_GASTOS_MATERIALES: GastosMaterialesElement[] = [];

export interface GastosServicioElement {
  NombreItem?: string;
  Cantidad?: number;
  NombreUnidadMedida?: string;
  NombreMoneda?: string;
  PrecioUnitario?: number;
  MontoTotal?: number;
  Documento: string;
  Descripcion?: string;
}

const ELEMENT_GASTOS_SERVICIO: GastosServicioElement[] = [];
@Component({
  selector: 'app-editarsolicitud',
  templateUrl: './editarsolicitud.component.html',
  styleUrls: ['./editarsolicitud.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class EditarSolicitudComponent implements OnInit {
  contentLoaded: boolean = false;
  listEquipo: any = [];
  mode = new UntypedFormControl('side');
  datosEdi: any = {};
  progressRef!: NgProgressRef;
  value: number = 0;
  etipobandejaFacturacion = EtipobandejaFacturacion;
  valuesautocompletegrupounidad: any = {}
  setvaluesautocompletegrupounidad: any = {}
  lblFechaRegistro: any = "";
  /*Adjunto Reporte Tecnico*/
  isLoadingAdjuntoReporteTecnico = false;
  dataSourceAdjuntoReporteTecnico = new MatTableDataSource<AdjuntorReporteTecnicoElement>(ELEMENT_DATAADJUNTOREPORTETECNICO);
  @ViewChild('paginatorAdjuntoReporteTecnico') paginatorAdjuntoReporteTecnico!: MatPaginator;
  displayedColumnsAdjuntoReporteTecnico: string[] = ['menu', 'NombreExterno', 'Tipo', 'NombreUsuario', 'FechaRegistro'];

  /*Adjunto Presupuesto*/
  dataSourceAdjuntoPresupuesto = new MatTableDataSource<AdjuntoPrespuestoElement>(ELEMENT_ADJUNTO_PRESUPUESTO);
  @ViewChild('paginatorPresupuesto') paginatorPresupuesto!: MatPaginator;
  displayedColumnsPresupuesto: string[] = ['menu', 'NombreExterno', 'Tipo', 'NombreUsuario', 'FechaRegistro'];

  dataSourceTarifadosServicio = new MatTableDataSource<TarifadosServicioElement>(ELEMENT_TARIFADOS_SERVICIO);
  @ViewChild('paginatorTarifadosServicio') paginatorTarifadosServicio!: MatPaginator;
  displayedColumnsTarifadosServicio: string[] = ['select', 'Codigo', 'NombreItem', 'NombreUnidadMedida', 'NombreMoneda',
    'PrecioUnitario', 'Cantidad', 'MontoTotal', 'Fija', 'Var', 'Ind', 'Pen'];
  selectionTarifadoServicio = new SelectionModel<TarifadosServicioElement>(true, []);

  dataSourceTarifadosMateriales = new MatTableDataSource<TarifadosMaterialesElement>(ELEMENT_TARIFADOS_MATERIALES);
  @ViewChild('paginatorTarifadosMateriales') paginatorTarifadosMateriales!: MatPaginator;
  displayedColumnsTarifadosMateriales: string[] = ['select', 'Codigo', 'NombreItem', 'NombreUnidadMedida', 'NombreMoneda',
    'PrecioUnitario', 'Cantidad', 'MontoTotal', 'Fija', 'Var', 'Ind', 'Pen'];
  selectionTarifadoMateriales = new SelectionModel<TarifadosMaterialesElement>(true, []);

  dataSourceGatosMateriales = new MatTableDataSource<GastosMaterialesElement>(ELEMENT_GASTOS_MATERIALES);
  @ViewChild('paginatorGastosMateriales') paginatorGastosMateriales!: MatPaginator;
  displayedColumnsGastosMateriales: string[] = ['select', 'Codigo', 'NombreItem', 'NombreUnidadMedida', 'NombreMoneda',
    'PrecioUnitario', 'Cantidad', 'MontoTotal', 'Fija', 'Var', 'Ind', 'Pen'];
  selectionGastosMateriales = new SelectionModel<GastosMaterialesElement>(true, []);


  dataSourceGatosServicio = new MatTableDataSource<GastosServicioElement>(ELEMENT_GASTOS_SERVICIO);
  @ViewChild('paginatorGastosServicio') paginatorGastosServicio!: MatPaginator;
  displayedColumnsGastosServicio: string[] = ['select', 'NombreItem', 'Cantidad', 'NombreUnidadMedida', 'NombreMoneda',
    'PrecioUnitario', 'MontoTotal', 'Documento', 'Descripcion'];
  selectionGastosServicio = new SelectionModel<GastosServicioElement>(true, []);

  porcentajeVariacionServicio: number = 0;
  porcentajeVariacionMateriales: number = 0;

  IdTipoFlujo: number = 0;
  matexpansionpaneldatosgenerales: boolean = false;
  dataSolicitarAprobacionPresupuesto: SolicitarAprobacionPresupuesto = {};
  datasolicitudEnviarProveeedor: SolicitudEnviarProveeedor = {};
  datasolicitudReporteTecnico: SolicitudReporteTecnico = {};
  listTipoAveria: any = [];
  listTipoSolucion: any = [];
  listAdjuntosGenerales: AdjuntoCloudElement[] = [];
  isLoadingAdjuntosGenerales: boolean = false;
  IdSolicitud: number = 0;
  lblMonedaPresupuesto: string = "";
  lblFechaHoraFinAtencion: any;
  AprobadoresPresupuesto: string = "";
  AprobadoresRequerimientos: string = "";
  InspectoresSolicitudFM: any = [];
  lblUnidadMantenimiento: string = "";
  lblAdministrativo: string = "";
  btnRechazoAsignacionSolicitud: boolean = false;
  btnAnularSolicitud: boolean = false;
  btnRevisarPresupuesto: boolean = false;
  btnRegistroSolicitud: boolean = false;
  btnGrabarSolicitudEnFranqueo: boolean = false;
  btnReasignarInspector: boolean = false;
  btnActualizarSubEstadoUnidadMantenimiento: boolean = false;
  btnEnviarAprobarTarifado: boolean = false;
  btnAprobarTarifado: boolean = false;
  btnRechazarTarifado: boolean = false;
  btnSolicitarFranqueo: boolean = false;

  btnEnvioProveedor: boolean = false;
  btnRechazarTrabajoSolicitud: boolean = false;
  btnAceptarRechazoSolicitud: boolean = false;
  btnCancelarRechazoSolicitud: boolean = false;
  imbEnviarFacturacion: boolean = false;


  listOpciones: any = {};
  InspectorCliente: string = "";
  FechRegistroSolicitud: string | null = "";
  IdsCliente: any = [];
  IdCliente: number = 0;
  IdsProveedor: any = [];
  listSolicitanteSeteado: any = [];
  listTecnicoInformeSeteado: any = [];
  listTecnicoDatosGeneralesSeteado: any = [];
  IdsSolicitante: any = [];
  datosSiniestro: any = {}
  datosAcciones: any = {};
  constructor(
    private ngProgress: NgProgress,
    public dialogo: MatDialog,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    public router: Router,
    private datePipe: DatePipe,
    private solicitudesService: SolicitudesService,
    private administracionService: AdministracionService,
    private route: ActivatedRoute,
    private _authService: AuthService,
    private _utilsService: UtilsService,
    private azureService: AzureService,
  ) {
  }
  ngOnDestroy(): void {
    this.ngProgress.destroyAll();
  }
  public deleteImage(row: any) {
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
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

            })
          })
        }
      });
  }
  recibiRespuestaAutoCompleteGrupoUnidad(event: any): void {
    console.log(event);
  }

  public downloadImage(row: any) {
    this.azureService.downloadImagefile(row);
  }


  async ondropzoneReporteTecnico(event: any) {
    var files: any[] = [];
    for (const file of event.addedFiles) {
      if (this._utilsService.TamanioArchivoPermitido(file.size))
        files.push(file);
      else {
        this.bootstrapNotifyBarService.notifyWarning("El tamaño máximo de un archivo permitido es de 2 mb, los archivos con un tamaño superior a 2 mb se descartan.");
        return;
      }
    }
    var listArchivoBlobStorage: any = [];
    if (files.length > 0) {
      for await (const file of files) {
        const blob = new Blob([file], { type: file.type });
        const response = await this.azureService.uploadFile(blob, file.name);
        listArchivoBlobStorage.push({
          IdEntidad: this.IdSolicitud,
          IdCategoria: 0,
          CodigoTabla: 233,
          NombreInterno: response.uuidFileName,
          NombreExterno: file.name,
          NombreExtension: "." + file.name.split(".").pop(),
          Tamanio: file?.size,
          UsuarioRegistro: this.datosEdi.Id,
          NumeroGrupo: 3//ADJUNTO DE REPORTE TECNICO
        });
      }
      this.progressRef.start();
      var response = await this.administracionService.getGrabarAdjuntoCloud(listArchivoBlobStorage);
      if (response.Status === 'OK') {
        this.bootstrapNotifyBarService.notifySuccess(response.Message);
        //this.listarAdjuntoCloudReporteTecnico();
      }
      this.progressRef.complete();
    }
  }

  /**Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelectedTarifadoServicio() {
    const numSelected = this.selectionTarifadoServicio.selected.length;
    const numRows = this.dataSourceTarifadosServicio.data.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección. */
  masterToggleTarifadoServicio() {
    this.isAllSelectedTarifadoServicio() ?
      this.selectionTarifadoServicio.clear() :
      this.dataSourceTarifadosServicio.data.forEach(row => this.selectionTarifadoServicio.select(row));
  }

  /**Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelectedTarifadoMateriales() {
    const numSelected = this.selectionTarifadoMateriales.selected.length;
    const numRows = this.dataSourceTarifadosMateriales.data.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección. */
  masterToggleTarifadoMateriales() {
    this.isAllSelectedTarifadoMateriales() ?
      this.selectionTarifadoMateriales.clear() :
      this.dataSourceTarifadosMateriales.data.forEach(row => this.selectionTarifadoMateriales.select(row));
  }

  btnDescargarAdjuntoPresupuesto(row: any) {
    this.azureService.downloadImagefile(row);
    // this.administracionService.DescargarArchivoAdjunto(row.NombreInterno).then((respuesta) => {
    // });
  }

  btnEliminarAdjuntoPresupuesto(row: any) {
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Adjuntos`,
        mensaje: `¿Está seguro de eliminar el Documento?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          await this.administracionService.getElminarAdjunto({
            Id: row.Id,
            NombreInterno: row.NombreInterno
          });
        }
      });
  }

  ngAfterViewInit() {
    // this.timer.start(this.startDate);
    this.dataSourceAdjuntoPresupuesto.paginator = this.paginatorPresupuesto;
  }
  ngAfterViewInitReporteTecnico() {
    this.dataSourceAdjuntoReporteTecnico.paginator = this.paginatorAdjuntoReporteTecnico;
  }
  recibiRespuestaProveedor(event: any): void {
    this.datasolicitudEnviarProveeedor.IdProveedorSolicitud = event.length > 0 ? event.map((x: any) => {
      return x.Id
    })[0] : 0;
  }

  recibiRespuestaProveedorRecomendado(event: any): void {
    this.dataSolicitarAprobacionPresupuesto.IdProveedorRecomendado = event.length > 0 ? event.map((x: any) => {
      return x.Id
    })[0] : 0;
  }

  recibiRespuestaSolicitante(event: any): void {
    //this._filtro.IdsSolicitante = event.map((x: any) => {return x.Id});
  }

  recibiRespuestaTecnicoTabReporteTecnico(event: any): void {

    this.datasolicitudReporteTecnico.IdTecnico = event.length > 0 ? event.map((x: any) => {
      return x.Id
    })[0] : 0;
  }

  recibiRespuestaElaborador(event: any): void {
    this.dataSolicitarAprobacionPresupuesto.IdElaborador = event.length > 0 ? event.map((x: any) => {
      return x.Id
    })[0] : 0;
  }

  public onCheckedChangedRequiereAsociarAOtraSolicitud(arg: MatCheckboxChange) {
    //this._filtro.AplicaPresupuestosRechazados = arg.checked;
  };

  click_tabTarifados() {
    this.listarTarifadoServicio();
    this.listarTarifadoMateriales();
  }

  SelecteChangeTabGroupTarifados($event: any) {
    switch ($event.index) {
      case 0://Tarifados Servicio
        this.listarTarifadoServicio();
        break;
      case 1://Tarifados Materiales
        this.listarTarifadoMateriales();
        //this.listarTarifadosMateriales();
        break;
    }
  }

  listarTarifadosMateriales() {
    this.solicitudesService.ListarTarifadosMateriales({
      IdSolicitud: this.datosSiniestro.Id,
      IdTarifado: 0
    }).then((respuesta) => {
      this.dataSourceTarifadosMateriales.data = respuesta;
    });
  }

  btnFranquearRequerimiento_Click() {
    if (this.datosSiniestro.esFlujoRequerimiento) {  //Es Requerimiento
      this.dialogo.open(DialogoConfirmacionComponent, {
        maxWidth: '25vw',
        maxHeight: 'auto',
        height: 'auto',
        width: '25%',
        disableClose: true,
        data: {
          titulo: `Franqueo de Solicitud`,
          mensaje: `¿Desea Franquear la Solicitud?`
        }
      })
        .afterClosed()
        .subscribe(async (confirmado: Boolean) => {
          if (confirmado) {
            this.solicitudesService.FranqueoSolicitud({ IdSolicitud: this.datosSiniestro.Id }).then((response) => {
              if (response.TipoResultado == 1) {
                this.bootstrapNotifyBarService.notifySuccess(response.Mensaje);
                setTimeout(() => {
                  this.router.navigate(['/solicitud/bandejasolicitud'])
                }, 3000)
              }
            });
          }
        });

    } else {

      this.dialogo.open(DialogoConfirmacionComponent, {
        maxWidth: '25vw',
        maxHeight: 'auto',
        height: 'auto',
        width: '25%',
        disableClose: true,
        data: {
          titulo: `Franqueo de Solicitud`,
          mensaje: `¿Desea Franquear la Solicitud?`
        }
      })
        .afterClosed()
        .subscribe(async (confirmado: Boolean) => {
          if (confirmado) {
            this.solicitudesService.FranqueoSolicitud({ IdSolicitud: this.datosSiniestro.Id }).then((response) => {
              if (response.TipoResultado == 1) {
                this.bootstrapNotifyBarService.notifySuccess(response.Mensaje);
                setTimeout(() => {
                  this.router.navigate(['/solicitud/bandejasolicitud'])
                }, 3000)
              }
            });
          }
        });
    }
  }
  btnEliminarEquipo_onClick(IdEquipo: number) {

  }
  ngOnInit(): void {    
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.progressRef = this.ngProgress.ref();
    this.progressRef.state.subscribe((state: any) => {
      this.value = state.value;
    });
    this.dataSolicitarAprobacionPresupuesto.IdMoneda = "0";
    this.datasolicitudReporteTecnico.IdTipoSolucion = "0";
    this.datasolicitudReporteTecnico.IdTipoAveria = "0";
    let valor: any = this.route.snapshot.paramMap.get('id');
    this.IdSolicitud = parseInt(valor);
    this.solicitudesService.BuscarSolicitudPorId(parseInt(valor)).then((responseInmuble) => {
      this.contentLoaded = true;
      this.datosSiniestro = responseInmuble.data;
      this.lblFechaRegistro = this.datePipe.transform(this.datosSiniestro.FechaRegistro, 'dd/MM/yyyy HH:mm')?.toString();
      this.IdCliente = responseInmuble.data.IdCliente;
      this.datosAcciones = responseInmuble.accion;
      this.valuesautocompletegrupounidad = {
        IdCliente: this.datosSiniestro.IdCliente,
        IdTipoSolicitud: this.datosSiniestro.IdTipoSolicitud,
        IdUsuario: this.datosEdi.Id
      }

      if (this.datosSiniestro.lstEquipos.length > 0) {
        this.listEquipo = asEnumerable(this.datosSiniestro.lstEquipos)
          .Select((option, index: any) => { return { option, index }; })
          .GroupBy(
            x => Math.floor(x.index / 4),
            x => x.option,
            (key, options) => asEnumerable(options).ToArray()
          )
          .ToArray();
      }
      this.lblFechaHoraFinAtencion = this.datePipe.transform(this.datosSiniestro.FechaHoraFinAtencion, 'dd/MM/yyyy HH:mm');

      if (this.datosSiniestro.esFlujoRequerimiento)
        this.AprobadoresRequerimientos = this.datosSiniestro.listAprobadorRequerimiento.join("\n");
      this.AprobadoresPresupuesto = this.datosSiniestro.listAprobadorPresupuesto === null ? "" : this.datosSiniestro.listAprobadorPresupuesto.join("\n")
      if (this.datosSiniestro.adjuntos != null) {
        if (this.datosSiniestro.adjuntos.filter((x: any) => { return x.NumeroGrupo === 1 }).length > 0) {//Presupuesto
          this.dataSourceAdjuntoPresupuesto.data = this.datosSiniestro.adjuntos.filter((x: any) => { return x.NumeroGrupo === 1 });
          this.ngAfterViewInit();
        }
        if (this.datosSiniestro.adjuntos.filter((x: any) => { return x.NumeroGrupo === 2 }).length > 0) {//Reporte Tecnico
          this.dataSourceAdjuntoReporteTecnico.data = this.datosSiniestro.adjuntos.filter((x: any) => { return x.NumeroGrupo === 2 });
          this.ngAfterViewInitReporteTecnico();
        }
      }
    });
  }

  imbEnviarFacturacion_Click() {
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Enviar a Facturación`,
        mensaje: `¿Desea enviar a Facturar?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {

        }
      });
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

  // public deleteImage(row: any) {
  //
  //   this.dialog.open(DialogoConfirmacionComponent, {
  //     maxWidth: '25vw',
  //     maxHeight: 'auto',
  //     height: 'auto',
  //     width: '25%',
  //     data: {
  //       titulo: `Mensaje de Confirmación`,
  //       mensaje: `¿Esta seguro que desea eliminar?`
  //     }
  //   })
  //     .afterClosed()
  //     .subscribe(async (confirmado: Boolean) => {
  //       if (confirmado) {
  //         this.azureService.deleteImage(row.NombreInterno, () => {
  //           this.administracionService.getEliminarAdjuntoCloud(row.Id.toString()).then((res: any) => {
  //             this.listarAdjuntoCloud();
  //           })
  //         })
  //       }
  //     });
  // }
  //
  // public downloadImage(row: any) {
  //   this.azureService.downloadImagefile(row);
  // }

  public deleteImageGenerales(row: any) {

    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
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
              this.btnAdjuntos_Click();
            })
          })
        }
      });
  }

  btnAdjuntos_Click() {
    this.isLoadingAdjuntosGenerales = true;
    this.administracionService.getListarArchivoAdjuntoCloud({
      CodigoTabla: eEntidad.Solicitud,
      IdEntidad: this.datosSiniestro.Id,
      NumerosGrupo: '1,3',
    }).then((respuesta) => {
      this.listAdjuntosGenerales = respuesta;
      this.isLoadingAdjuntosGenerales = false;
    }, error => this.isLoadingAdjuntosGenerales = false);
  }

  /*listarAdjuntosPresupuesto() {
    this.administracionService.getListarAdjunto({//
      CodigoTabla: eEntidad.Solicitud,
      IdEntidad: this.datosSiniestro.Id,
      IdCategoria: 1407,
      NumeroGrupo: 1,
      RetornarAdjuntosEnBytes: true
    }).then((respuesta) => {

      if (respuesta.TipoResultado == 1) {
        this.dataSourceAdjuntoPresupuesto.data = respuesta.ListAdjuntos;
        this.ngAfterViewInit();
      }
    });
  }*/

  /*
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
  */

  Cancelar() {
    this.router.navigate(['/solicitud/bandejasolicitud']);
  }

  public get eTipoFlujoSolicitud() {
    return eTipoFlujoSolicitud;
  }

  btnLlegadaASitio() {
    this.dialogo.open(DialogoRegFechaComponent, {
      maxWidth: '30vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '30%',
      disableClose: true,
    })
      .afterClosed()
      .subscribe((res: any) => {
        if (res.respuesta) {
          this.progressRef.start();
          var request: any = {};
          request.IdSolicitud = this.IdSolicitud;
          request.FechaHora = res.FechaRegistroAtencion;
          this.solicitudesService.postMarcarLlegadaASitio(request).then((respuesta) => {
            if (respuesta.TipoResultado == 1) { //EXITO
              this.progressRef.complete();
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              setTimeout(() => {
                this.Cancelar();
              }, 3000)
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });
  }

  btnAprobarParadaReloj() {
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Parada de Reloj`,
        mensaje: `¿Desea aceptar la parada de reloj?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          var request = {
            Aprobar: true,
            ListIdsSolicitud: [this.IdSolicitud]
          }
          this.solicitudesService.postAprobarRequerimientoSolicitud(request).then((responseInmuble) => {
            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.Cancelar();
            }
          });
        }
      });
  }

  btnRechazarParadaReloj() {
    this.dialogo.open(DialogoRechazarSolicutdComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdsSolicitud: this.IdSolicitud.toString(),
        titulo: `Rechazo Parada de Reloj`,
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if (confirmado.respuesta) {
          var request = {
            Aprobar: false,
            ListIdsSolicitud: [confirmado.IdsSolicitud],
            MotivoRechazo: confirmado.txtComentarioRechazo
          }
          this.solicitudesService.postAprobarRequerimientoSolicitud(request).then((responseInmuble) => {
            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.Cancelar();
            }
          });
        }
      });
  }

  btnSolicitarParadaReloj() {
    this.dialogo.open(DialogoParadaRelojComponent, {
      maxWidth: '35vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '35%',
      disableClose: true,
      /*data: {
        entidad: this.IdSolicitud.toString(),
        tabla: eEntidad.Solicitud,
      }*/
    })
      .afterClosed()
      .subscribe(async (res: any) => {
        if (res.respuesta) {
          this.progressRef.start();
          var request: any = {};
          request.IdSolicitud = this.IdSolicitud;
          request.FechaHora = res.FechaRegistroAtencion;
          request.IdMotivo = res.IdMotivo;
          request.DescripcionMotivoParada = res.DescripcionMotivoParada;
          this.solicitudesService.postSolicitarParadaReloj(request).then((respuesta) => {
            if (respuesta.TipoResultado == 1) { //EXITO
              this.progressRef.complete();
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              setTimeout(() => {
                this.Cancelar();
              }, 3000)
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });
  }

  btnReactivarParadaReloj() {
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Reactivar Reloj`,
        mensaje: `¿Desea reactivar el reloj?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          this.solicitudesService.getReactivarParadaReloj(this.IdSolicitud).then((respuesta) => {
            if (respuesta.TipoResultado == 1) { //EXITO
              this.progressRef.complete();
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              setTimeout(() => {
                this.Cancelar();
              }, 3000)
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });

  }

  btnVerLogAccion_onClick() {
    this.dialogo.open(DialogoLogAccionComponent, {
      maxWidth: '60vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '60%',
      disableClose: true,
      data: {
        entidad: this.IdSolicitud.toString(),
        tabla: eEntidad.Solicitud,
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {

        }
      });
  }

  btnVerTiempo_onClick() {
    this.dialogo.open(DialogoVerTiempoComponent, {
      maxWidth: '35vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '35%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud.toString()
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {

        }
      });
  }

  btnAtenderSolicitud_onClick() {
    var request: any = {};
    var requestFile: any = [];

    if (this.datosSiniestro.esFlujoRequerimiento) { //Es Requerimiento
      if (this.datosAcciones.ObligarReporteTecnico) {
        this.dialogo.open(DialogoReporteTecnicoComponent, {
          maxWidth: '70vw',
          maxHeight: 'auto',
          height: 'auto',
          width: '70%',
          disableClose: true,
          data: {
            IdsSolicitud: this.IdSolicitud,
            IdsCliente: this.IdCliente,
            IdsProveedor: this.datosSiniestro.presupuesto.IdProveedorPresupuesto,
            titulo: `REPORTE TECNICO `,
          }
        })
          .afterClosed()
          .subscribe(async (res: any) => {
            if (res.respuesta) {
              request = res.request;
              requestFile = res.requestFiles;
              if (this.datosAcciones.permiteModificarFechaHoraAtencion) {
                this.dialogo.open(DialogoRegFechaComponent, {
                  maxWidth: '30vw',
                  maxHeight: 'auto',
                  height: 'auto',
                  width: '30%',
                  disableClose: true,
                })
                  .afterClosed()
                  .subscribe(async (res: any) => {
                    if (res.respuesta) {
                      this.progressRef.start();
                      request.FechaHora = res.FechaRegistroAtencion;

                      /*Adjuntos cloud*/
                      var listArchivoBlobStorage: any = [];
                      if (requestFile.length > 0) {
                        for await (const file of requestFile) {
                          const blob = new Blob([file], { type: file.type });
                          const response = await this.azureService.uploadFile(blob, file.name);
                          listArchivoBlobStorage.push({
                            NombreInterno: response.uuidFileName,
                            Nombre: file.name,
                            NombreExtension: "." + file.name.split(".").pop(),
                            Tamanio: file?.size,
                          });
                        }
                        request.reporteTecnico.listAdjuntos = listArchivoBlobStorage;
                      }
                      this.solicitudesService.postAtenderSolicitudNvo(request).then((respuesta) => {
                        if (respuesta.TipoResultado == 1) { //EXITO
                          this.progressRef.complete();
                          this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
                          setTimeout(() => {
                            this.Cancelar();
                          }, 3000)
                        } else if (respuesta.TipoResultado == 2) {//ERROR
                          this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
                        } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
                          this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
                        }
                        this.progressRef.complete();
                      });
                    }
                  });
              } else {

              }
            }
          });
      } else {
        if (this.datosAcciones.permiteModificarFechaHoraAtencion) {
          this.dialogo.open(DialogoRegFechaComponent, {
            maxWidth: '30vw',
            maxHeight: 'auto',
            height: 'auto',
            width: '30%',
            disableClose: true,
          })
            .afterClosed()
            .subscribe(async (res: any) => {
              if (res.respuesta) {
                this.progressRef.start();
                this.solicitudesService.RegistrarFechaAtencionSolicitud({
                  IdSolicitud: this.datosSiniestro.Id,
                  FechaRegistroAtencion: res.FechaRegistroAtencion
                }).then((respuesta) => {
                  if (respuesta.Status === "OK") {
                    this.bootstrapNotifyBarService.notifySuccess(respuesta.Message);
                    setTimeout(() => {
                      this.router.navigate(['/solicitud/bandejasolicitud'])
                    }, 5010)
                  } else if (respuesta.Status === "WARNING") {
                    this.bootstrapNotifyBarService.notifyWarning(respuesta.Message);
                  }
                  this.progressRef.complete();
                });
              }
            });
        }
      }
    } else { //Es incidencia
      if (this.datosAcciones.ObligarReporteTecnico) {
        this.dialogo.open(DialogoReporteTecnicoComponent, {
          maxWidth: '50vw',
          maxHeight: 'auto',
          height: 'auto',
          width: '50%',
          disableClose: true,
          data: {
            IdsSolicitud: this.IdSolicitud,
            IdsCliente: this.IdCliente,
            IdsProveedor: 2,
            titulo: `REPORTE TECNICO `,
          }
        })
          .afterClosed()
          .subscribe(async (res: any) => {
            if (res.respuesta) {
              request = res.request;
              if (this.datosAcciones.permiteModificarFechaHoraAtencion) {
                this.dialogo.open(DialogoRegFechaComponent, {
                  maxWidth: '30vw',
                  maxHeight: 'auto',
                  height: 'auto',
                  width: '30%',
                  disableClose: true,
                })
                  .afterClosed()
                  .subscribe(async (res: any) => {
                    if (res.respuesta) {
                      this.progressRef.start();
                      request.FechaHora = res.FechaRegistroAtencion;
                      this.solicitudesService.postAtenderSolicitudNvo(request).then((respuesta) => {
                        if (respuesta.TipoResultado == 1) { //EXITO
                          this.progressRef.complete();
                          this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
                          setTimeout(() => {
                            this.Cancelar();
                          }, 3000)
                        } else if (respuesta.TipoResultado == 2) {//ERROR
                          this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
                        } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
                          this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
                        }
                        this.progressRef.complete();
                      });
                    }
                  });
              } else {

              }
            }
          });
      } else {
        if (this.datosAcciones.permiteModificarFechaHoraAtencion) {
          this.dialogo.open(DialogoRegFechaComponent, {
            maxWidth: '30vw',
            maxHeight: 'auto',
            height: 'auto',
            width: '30%',
            disableClose: true,
          })
            .afterClosed()
            .subscribe(async (res: any) => {
              if (res.respuesta) {
                this.progressRef.start();

                this.solicitudesService.postAtenderSolicitudNvo(
                  {
                    IdSolicitud: this.IdSolicitud,
                    reporteTecnico: null,
                    FechaHora: res.FechaRegistroAtencion
                  }
                ).then((respuesta) => {
                  if (respuesta.TipoResultado == 1) { //EXITO
                    this.progressRef.complete();
                    this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
                    setTimeout(() => {
                      this.Cancelar();
                    }, 3000)
                  } else if (respuesta.TipoResultado == 2) {//ERROR
                    this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
                  } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
                    this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
                  }
                  this.progressRef.complete();
                });
              }
            });
        }
      }
    }
  }

  btnRechazarRequerimiento_onClick() {
    this.dialogo.open(DialogoRechazarSolicutdComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdsSolicitud: this.IdSolicitud.toString(),
        titulo: `Motivo`,
        accion: eAccionPendientes.RechazarRequerimiento
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if (confirmado.respuesta) {
          var request = {
            Aprobar: false,
            ListIdsSolicitud: [confirmado.IdsSolicitud],
            MotivoRechazo: confirmado.txtComentarioRechazo
          }
          this.solicitudesService.postAprobarRequerimientoSolicitud(request).then((responseInmuble) => {
            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.Cancelar();
            }
          });
        }
      });
  }


  btnEnvioProveedor_onClick() {
    this.dialogo.open(DialogoEnviarProveedorSolicutdComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        IdsCliente: this.IdCliente,
        SolicitarMontoConciliadoyPlazoTermino: this.datosAcciones.SolicitarMontoConciliadoyPlazoTermino,
        MontoPresupuesto: this.datosSiniestro.presupuesto === null ? 0 : this.datosSiniestro.presupuesto.MontoPresupuesto,
        titulo: `Enviar Proveedor`,
      }
    })
      .afterClosed()
      .subscribe((response: any) => {

        if (response.respuesta) {
          setTimeout(() => {
            this.router.navigate(['/solicitud/bandejasolicitud'])
          }, 3000)
        }
      });
  }

  btnAprobarPresupuesto_onClick() {
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Registro de Solicitud`,
        mensaje: `¿Desea Aprobar el Presupuesto?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          var request = {
            Aprobar: true,
            ListIdsSolicitud: [this.IdSolicitud]
          }
          this.solicitudesService.postAprobarRequerimientoSolicitud(request).then((responseInmuble) => {
            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.Cancelar();
            }
          });
        }
      });
  }

  btnEnviarAprobarTarifado_Click() {
    var TotalTarifados = this.dataSourceTarifadosServicio.data.length + this.dataSourceTarifadosMateriales.data.length;
    if (TotalTarifados === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Tarifados: Debe Registrar Tarifados en la Solicitud.");
    } else {
      this.solicitudesService.getEnviarAprobarelTarifado(this.IdSolicitud).then((responseInmuble) => {
        if (responseInmuble.TipoResultado == 1) {
          this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
          this.Cancelar();
        }
      });
    }
  }

  btnAprobarTarifado_Click() {
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '30vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '30%',
      disableClose: true,
      data: {
        IdsSolicitud: this.IdSolicitud.toString(),
        titulo: `Aprobar Tarifario`,
        mensaje: `¿Desea Aprobar el Tarifario?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          var request = {
            Aprobar: true,
            ListIdsSolicitud: [this.IdSolicitud]
          }
          this.solicitudesService.postAprobarRequerimientoSolicitud(request).then((responseInmuble) => {
            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.Cancelar();
            }
          });
        }
      });
  }


  // btnAnularSolicitud_Click() {
  //   this.dialogo.open(DialogoAnularSolicitudComponent, {
  //     maxWidth: '40vw',
  //     maxHeight: 'auto',
  //     height: 'auto',
  //     width: '40%',
  //     disableClose: true,
  //     data: {
  //       IdsSolicitud: this.IdSolicitud.toString(),
  //       titulo: `Motivo Anulación`,
  //     }
  //   })
  //     .afterClosed()
  //     .subscribe(async (confirmado: any) => {
  //       if (confirmado.respuesta) {
  //         var request = {
  //           lstSolicitud: [confirmado.IdsSolicitud],
  //           motivoAnulacion: confirmado.txtComentarioRechazo
  //         }
  //         this.solicitudesService.postAnularSolicitudes(request).then((responseInmuble) => {
            
  //           if (responseInmuble.TipoResultado == 1) {
  //             this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);               
  //           }
  //           if (responseInmuble.TipoResultado == 2) {              
  //             this.bootstrapNotifyBarService.notifyWarning(responseInmuble.Mensaje);
  //           }
  //         });
  //       }
  //     });
  // }
  btnRechazarTarifado_Click() {
    this.dialogo.open(DialogoRechazarSolicutdComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdsSolicitud: this.IdSolicitud.toString(),
        titulo: `Motivo`,
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if (confirmado.respuesta) {
          var request = {
            Aprobar: false,
            ListIdsSolicitud: [confirmado.IdsSolicitud],
            MotivoRechazo: confirmado.txtComentarioRechazo
          }
          this.solicitudesService.postAprobarRequerimientoSolicitud(request).then((responseInmuble) => {
            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.Cancelar();
            }
          });
        }
      });
  }
  btnDarConformidad_Click() {
    this.dialogo.open(DialogoEncuestaComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        titulo: `Calificación Usuario`,
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {

        if (confirmado.respuesta) {
          this.progressRef.start();
          this.solicitudesService.postDarConformidad(confirmado.request).then((responseInmuble) => {

            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.progressRef.complete();
              this.Cancelar();
            }
          });
        }
      });
  }
  btnRechazarPresupuesto_onClick() {
    this.dialogo.open(DialogoRechazarSolicutdComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdsSolicitud: this.IdSolicitud.toString(),
        titulo: `Motivo`,
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if (confirmado.respuesta) {
          var request = {
            Aprobar: false,
            ListIdsSolicitud: [confirmado.IdsSolicitud],
            MotivoRechazo: confirmado.txtComentarioRechazo
          }
          this.solicitudesService.postAprobarRequerimientoSolicitud(request).then((responseInmuble) => {
            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.Cancelar();
            }
          });
        }
      });
  }

  btnRevisarPresupuesto_onClick() {
    this.dialogo.open(DialogoRechazarSolicutdComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdsSolicitud: this.IdSolicitud.toString(),
        titulo: `Motivo`,
        accion: eAccionPendientes.RevisarPresupuesto
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {

        }
      });
  }
  btnSolicitarPresupuesto_onClick() {
    this.dialogo.open(DialogoSolicitarPresupuestosComponent, {
      maxWidth: '70vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '70%',
      disableClose: true,
      data: {
        IdsSolicitud: this.IdSolicitud.toString(),
        IdsCliente: this.IdCliente,
        titulo: `SOLICITAR APROBACIÓN DEL PRESUPUESTO `,
      }
    })
      .afterClosed()
      .subscribe(async (res: any) => {
        if (res.respuesta) {
          this.dialogo.open(DialogoConfirmacionComponent, {
            maxWidth: '30vw',
            maxHeight: 'auto',
            height: 'auto',
            width: '30%',
            disableClose: true,
            data: {
              IdsSolicitud: this.IdSolicitud.toString(),
              titulo: `Solicitar Presupuesto`,
              mensaje: `¿Desea Solicitar el Presupuesto?`
            }
          })
            .afterClosed()
            .subscribe(async (confirmado: Boolean) => {
              if (confirmado) {
                this.progressRef.start();
                res.request.IdSolicitud = this.datosSiniestro.Id;
                res.request.lstAprobadores = this.datosAcciones.ListAprobadoresPresupuesto.map((x: any) => {
                  return x.Id
                });

                /*Adjuntos cloud*/
                var listArchivoBlobStorage: any = [];
                if (res.requestFiles.length > 0) {
                  for await (const file of res.requestFiles) {
                    const blob = new Blob([file], { type: file.type });
                    const response = await this.azureService.uploadFile(blob, file.name);
                    listArchivoBlobStorage.push({
                      NombreInterno: response.uuidFileName,
                      Nombre: file.name,
                      NombreExtension: "." + file.name.split(".").pop(),
                      Tamanio: file?.size
                    });
                  }
                  res.request.listAdjuntos = listArchivoBlobStorage;
                }
                this.solicitudesService.postSolicitarAprobacionPresupuesto(res.request).then((responseInmuble) => {
                  if (responseInmuble.TipoResultado == 1) {
                    this.progressRef.complete();
                    this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
                    this.Cancelar();
                  }
                });
              }
            });
        }
      });
  }

  btnNuevoTarifarioDelServicio(): void {
    this.dialogo.open(DialogoTarifarioDelServicioComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        titulo: `DEL TARIFARIO DE SERVICIO `,
        servicio: null
      }
    })
      .afterClosed()
      .subscribe(async (res: any) => {

        if (res.respuesta) {
          this.solicitudesService.postTarifadoServicioDesdeTarifario(res.request).then((respuesta) => {

            if (respuesta.TipoResultado == 1) { //EXITO
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              this.progressRef.complete();
              this.listarTarifadoServicio();
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });


        }
      });
  }
  btnNuevoTarifarioDelMateriales(): void {
    this.dialogo.open(DialogoTarifarioDeMaterialesComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        titulo: `DEL TARIFARIO DE MATERIALES `,
        material: null
      }
    })
      .afterClosed()
      .subscribe(async (res: any) => {
        if (res.respuesta) {

          this.progressRef.start();
          this.solicitudesService.postTarifadoMaterialDesdeTarifario(res.request).then((respuesta) => {

            if (respuesta.TipoResultado == 1) { //EXITO
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              this.progressRef.complete();
              this.listarTarifadoMateriales();
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });
  }



  btnAprobarRequerimiento_Click() {
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '30vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '30%',
      disableClose: true,
      data: {
        IdsSolicitud: this.IdSolicitud.toString(),
        titulo: `Aprobar Requerimiento`,
        mensaje: `¿Desea Aprobar el Requerimiento?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          var request = {
            Aprobar: true,
            ListIdsSolicitud: [this.IdSolicitud]
          }
          this.solicitudesService.postAprobarRequerimientoSolicitud(request).then((responseInmuble) => {
            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.Cancelar();
            }
          });
        }
      });
  }
  btnEditarTarifarioMateriales() {
    if (this.selectionTarifadoMateriales.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione al menos un Material");
      return;
    }
    if (this.selectionTarifadoMateriales.selected.length > 1) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione un Material");
      return;
    }

    this.dialogo.open(DialogoTarifarioMaterialesComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        titulo: `REGISTRAR TARIFADOS DE MATERIALES `,
        material: this.selectionTarifadoMateriales.selected === undefined ? null : this.selectionTarifadoMateriales.selected[0]
      }
    })
      .afterClosed()
      .subscribe(async (res: any) => {

        if (res.respuesta) {
          this.progressRef.start();
          this.solicitudesService.postActualizarTarifadoMateriales(res.request).then((respuesta) => {
            if (respuesta.TipoResultado == 1) { //EXITO
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              this.progressRef.complete();
              this.listarTarifadoMateriales();
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });
  }
  btnNuevoTarifarioMateriales(): void {
    this.dialogo.open(DialogoTarifarioMaterialesComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        titulo: `REGISTRAR TARIFADOS DE MATERIALES `,
        material: null
      }
    })
      .afterClosed()
      .subscribe(async (res: any) => {
        if (res.respuesta) {

          this.progressRef.start();
          this.solicitudesService.postTarifadoMateriales(res.request).then((respuesta) => {
            if (respuesta.TipoResultado == 1) { //EXITO
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              this.progressRef.complete();
              this.listarTarifadoMateriales();
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });
  }
  listarTarifadoMateriales() {
    this.solicitudesService.getListarTarifadoMaterialesxSt(this.IdSolicitud).then((respuesta) => {
      if (respuesta.TipoResultado == 1) { //EXITO
        this.dataSourceTarifadosMateriales.data = respuesta.lista;
      }
      /* else if (respuesta.TipoResultado == 2) {//ERROR
        this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
      } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
        this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
      }*/
      this.progressRef.complete();
    });
  }
  btnEliminarTarifarioMateriales(): void {
    if (this.selectionTarifadoMateriales.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione al menos un Servicio");
      return;
    }
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Mensaje de Confirmación`,
        mensaje: `¿Esta seguro que desea eliminar?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          var IdsTarifadoMateriales = this.selectionTarifadoMateriales.selected.map((x: any) => { return x.Id }).join(",");
          this.solicitudesService.deleteTarifadoMateriales(IdsTarifadoMateriales).subscribe((res: any) => {
            if (res.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
              this.listarTarifadoMateriales();
            } else {
              this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
            }
          });
        }
      });
  }


  btnEditarTarifarioServicio() {
    if (this.selectionTarifadoServicio.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione al menos un Servicio");
      return;
    }
    if (this.selectionTarifadoServicio.selected.length > 1) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione un Servicio");
      return;
    }

    this.dialogo.open(DialogoTarifarioServicioComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        titulo: `REGISTRAR TARIFADOS DE SERVICIO `,
        servicio: this.selectionTarifadoServicio.selected === undefined ? null : this.selectionTarifadoServicio.selected[0]
      }
    })
      .afterClosed()
      .subscribe(async (res: any) => {

        if (res.respuesta) {
          this.progressRef.start();
          this.solicitudesService.postActualizarTarifadoServicios(res.request).then((respuesta) => {
            if (respuesta.TipoResultado == 1) { //EXITO
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              this.progressRef.complete();
              this.listarTarifadoServicio();
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });
  }
  btnNuevoTarifarioServicio(): void {
    this.dialogo.open(DialogoTarifarioServicioComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        titulo: ` `,
        servicio: null
      }
    })
      .afterClosed()
      .subscribe(async (res: any) => {

        if (res.respuesta) {

          this.solicitudesService.postTarifadoServicios(res.request).then((respuesta) => {
            if (respuesta.TipoResultado == 1) { //EXITO
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              this.progressRef.complete();
              this.listarTarifadoServicio();
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });
  }
  listarTarifadoServicio() {
    this.solicitudesService.getListarTarifadoServicioxSt(this.IdSolicitud).then((respuesta) => {
      if (respuesta.TipoResultado == 1) { //EXITO
        this.dataSourceTarifadosServicio.data = respuesta.lista;
      }
      /* else if (respuesta.TipoResultado == 2) {//ERROR
        this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
      } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
        this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
      }*/
      //this.progressRef.complete();
    });
  }
  btnEliminarTarifarioServicio(): void {
    if (this.selectionTarifadoServicio.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione al menos un Servicio");
      return;
    }
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Mensaje de Confirmación`,
        mensaje: `¿Esta seguro que desea eliminar?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          var IdsTarifadoServicio = this.selectionTarifadoServicio.selected.map((x: any) => { return x.Id }).join(",");
          this.solicitudesService.deleteTarifadoServicio(IdsTarifadoServicio).subscribe((res: any) => {
            if (res.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
              this.listarTarifadoServicio();
            } else {
              this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
            }
          });
        }
      });
  }

  btnAplicarPorcServicio() {
    if (this.selectionTarifadoServicio.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Selecione los Servicios a Aplicar");
      return;
    }
    if (this.porcentajeVariacionServicio == 0 || this.porcentajeVariacionServicio === null) {
      this.bootstrapNotifyBarService.notifyWarning("debe ingresar valor");
      return;
    }
    this.progressRef.start();
    var request = {
      IdSolicitud: this.IdSolicitud,
      listIds: this.selectionTarifadoServicio.selected.map((x: any) => { return x.Id }),
      porcentaje: this.porcentajeVariacionServicio
    }
    this.progressRef.start();
    this.solicitudesService.postAplicarPorcentajeServicio(request).then((respuesta) => {
      if (respuesta.TipoResultado == 1) { //EXITO
        this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
        this.progressRef.complete();
        this.listarTarifadoServicio();
      } else if (respuesta.TipoResultado == 2) {//ERROR
        this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
      } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
        this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
      }
      this.progressRef.complete();
    });
  }

  btnAplicarPorcMateriales() {
    if (this.selectionTarifadoMateriales.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Selecione los Servicios a Aplicar");
      return;
    }
    if (this.porcentajeVariacionMateriales == 0 || this.porcentajeVariacionMateriales === null) {
      this.bootstrapNotifyBarService.notifyWarning("debe ingresar valor");
      return;
    }
    this.progressRef.start();
    var request = {
      IdSolicitud: this.IdSolicitud,
      listIds: this.selectionTarifadoMateriales.selected.map((x: any) => { return x.Id }),
      porcentaje: this.porcentajeVariacionMateriales
    }
    this.progressRef.start();
    this.solicitudesService.postAplicarPorcentajeMaterial(request).then((respuesta) => {
      if (respuesta.TipoResultado == 1) { //EXITO
        this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
        this.progressRef.complete();
        this.listarTarifadoMateriales();
      } else if (respuesta.TipoResultado == 2) {//ERROR
        this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
      } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
        this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
      }
      this.progressRef.complete();
    });
  }

  clickMenu() {
    this.dialogo.open(DialogoTiempoatencionComponent, {
      position: { right: "1", top: "0" },
      //maxWidth: '20vw',
      maxHeight: 'auto',
      height: '100%',
      //width: '20%',
      //disableClose: true,
      data: {
        fechaFin: this.datosAcciones.datosReloj.fechaFin,
        relojCorre: this.datosAcciones.datosReloj.relojCorre

      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {

      });
  }

  flagminimizeDatosAdicionales: boolean = false;
  flagActivoBotonMinizado: boolean = false;
  over() {
    if (this.flagActivoBotonMinizado) {
      this.flagminimizeDatosAdicionales = !this.flagminimizeDatosAdicionales;
    }

  }
  out() {
    if (this.flagActivoBotonMinizado) {
      this.flagminimizeDatosAdicionales = !this.flagminimizeDatosAdicionales;
    }
  }
  minimizeDatosAdicionales() {
    this.flagminimizeDatosAdicionales = !this.flagminimizeDatosAdicionales;
    this.flagActivoBotonMinizado = !this.flagActivoBotonMinizado;
  }
  /**Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelectedGastosServicio() {
    const numSelected = this.selectionGastosServicio.selected.length;
    const numRows = this.dataSourceGatosServicio.data.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección. */
  masterToggleGastosServicio() {
    this.isAllSelectedGastosServicio() ?
      this.selectionGastosServicio.clear() :
      this.dataSourceGatosServicio.data.forEach(row => this.selectionGastosServicio.select(row));
  }

  btnEditarGastosServicio() {
    if (this.selectionGastosServicio.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione al menos un Servicio");
      return;
    }
    if (this.selectionGastosServicio.selected.length > 1) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione un Servicio");
      return;
    }

    this.dialogo.open(DialogoServicioPrecarioComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        titulo: `REGISTRAR TARIFADOS DE SERVICIO `,
        servicio: this.selectionGastosServicio.selected === undefined ? null : this.selectionGastosServicio.selected[0]
      }
    })
      .afterClosed()
      .subscribe(async (res: any) => {

        if (res.respuesta) {
          this.progressRef.start();
          this.solicitudesService.postGrabarActualizarGastoServicio(res.request).then((respuesta) => {
            if (respuesta.TipoResultado == 1) { //EXITO
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              this.listarGastosServicio();
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });
  }
  btnNuevoGastosServicio(): void {
    this.dialogo.open(DialogoServicioPrecarioComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        IdSolicitud: this.IdSolicitud,
        titulo: `REGISTRO DEL SERVICIO DEL PRECIARIO `,
        servicio: null
      }
    })
      .afterClosed()
      .subscribe(async (res: any) => {
        if (res.respuesta) {
          this.progressRef.start();
          this.solicitudesService.postGrabarActualizarGastoServicio(res.request).then((respuesta) => {
            if (respuesta.TipoResultado == 1) { //EXITO
              this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
              this.listarGastosServicio();
            } else if (respuesta.TipoResultado == 2) {//ERROR
              this.bootstrapNotifyBarService.notifyDanger(respuesta.Mensaje);
            } else if (respuesta.TipoResultado == 3) {//ADVERTENCIA
              this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
            }
            this.progressRef.complete();
          });
        }
      });
  }
  listarGastosServicio() {
    this.solicitudesService.getListarGastoServicioxSt(this.IdSolicitud).then((respuesta) => {
      if (respuesta.TipoResultado == 1) { //EXITO
        this.dataSourceGatosServicio.data = respuesta.lista;
      }
      this.progressRef.complete();
    });
  }
  btnEliminarGastosServicio(): void {
    if (this.selectionGastosServicio.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione al menos un Servicio");
      return;
    }
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Mensaje de Confirmación`,
        mensaje: `¿Esta seguro que desea eliminar?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          var IdsTarifadoServicio = this.selectionGastosServicio.selected.map((x: any) => { return x.Id }).join(",");
          this.solicitudesService.deleteGastoServicio(IdsTarifadoServicio).subscribe((res: any) => {

            if (res.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
              this.listarGastosServicio();
            } else {
              this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
            }
          });
        }
      });
  }
  click_tabGastos() {
    this.listarGastosServicio();
  }
}
