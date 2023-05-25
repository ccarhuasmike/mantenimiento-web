import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SolicitudesService } from '../../services/solicitudes.service';
import { AuthService } from "@core/auth/auth.service";
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  eEstadoSolicitud
} from "@core/types/formatos.types";
import { ClienteService } from '@shared/services/cliente.service';
export interface Fruit {
  name: string;
}
import { CookieService } from 'ngx-cookie-service';
import { BootstrapNotifyBarService } from '@shared/services/bootstrap-notify.service';
import { DialogoAnularSolicitudComponent } from '@shared/components/dialogo-anularsolicitud/dialogo-anularsolicitud.component';
import { DialogoRestaurarSolicitudComponent } from "@shared/components/dialogo-restaurarsolicitud/dialogo-restaurarsolicitud.component";
import { DialogoCambiarTipoSolicitudComponent } from "@shared/components/dialogo-cambiartiposolicitud/dialogo-cambiartiposolicitud.component";
import { SelectionModel } from '@angular/cdk/collections';

export interface Acciones {
  mostrarAnular: boolean ;
  mostrarCambiarTipoSolicitud: boolean;
  mostrarRestaurarEstado: boolean;
  
}

@Component({
  selector: 'app-bandejasolicitud',
  templateUrl: './bandejasolicitud.component.html',
  styleUrls: ['./bandejasolicitud.component.css'],
  providers: [CookieService]
})
export class BandejaSolicitudComponent implements OnInit, OnDestroy {
  eEstadoSolicitud = eEstadoSolicitud;
  fechaHoy = new Date();
  matexpansionpanelfiltro: boolean = false;
  isLoading = false;

  public itemsPerPage: number = 10;
  public totalRegistros: number = 0;
  public currentPage: number = 0;
  listClienteSeteado: any = [];
  listSolicitanteSeteado: any = [];
  public dataSource: any;
  public datosAcciones: Acciones = {
    mostrarAnular:false,
    mostrarCambiarTipoSolicitud:false,
    mostrarRestaurarEstado:false
  };
  
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;
  /*dateRange = new UntypedFormGroup({
    Codigo: new UntypedFormControl(''),
    startDate: new UntypedFormControl(),
    endDate: new UntypedFormControl(),
  });*/
  _filtroLocalStoreage: any = {};
  _filtro: any = {
    IdsCliente: [],
    IdsGrupoUnidad: [],
    IdsInmueble: [],
    IdsSolicitante: [],
    IdsProveedor: [],
    IdsInspector: [],
    IdsTipoSolicitud: [],
    IdsZonal: [],
    IdsEstadoSolictud: [],
    Codigo: '',
    nroItmes: 5,
    CodigoExternoCliente: '',
    CodigoOrdenTrabajo: '',
    AplicaRequerimientosRechazados: false,
    AplicaPresupuestosRechazados: false,
    ConMateriales: false,
    ConTarifados: false,
    FechaRegDesde: this.sumarDias(new Date(), -7),
    FechaRegHasta: new Date()
  };
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];


  datosEdi: any = {};
  displayedColumns: string[] =
    [
      'select',
      'codigo',
      'NombreEstadoSolicitud',
      'FechaRegistro',
      'NombreTipoSolicitud',
      //'CodigoOrdenTrabajo',
      //'NombreCliente',
      'CodigoInmueble',
      'NombreInmueble',
      'FechaEstimadaAtencion',
      'NombreProveedores',
      'FechaHoraFinAtencion',
      /*
      'NombreEdificio',
      'NombreNivel',
      'NombreGrupoMantenimiento',
      'NombreUnidadMantenimiento',
      'DescripcionDetallada',     
      'CentroCosto',
      'FechaHoraEnvioProveedor',  
      'DiasTranscurridos', */
      //'menu'
    ];

  constructor(
    public dialogo: MatDialog,
    private _authService: AuthService,
    public clienteService: ClienteService,
    private solicitudesService: SolicitudesService,
    private datePipe: DatePipe,
    private cookieService: CookieService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,

  ) {
    /*Cada vez que existe un cambio  en el objeto cartEvent se suscribira para que realizo un accion */
    clienteService.cartEvent$.subscribe((value) => {
      this.cookieService.delete('objetoClientePorUsuario');
      this.cookieService.set('objetoClientePorUsuario', JSON.stringify(value));
      this.ngOnInit();
    });
  }
  /**Si el número de elementos seleccionados coincide con el número total de filas. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }
  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  async btnResturarEstadoSolicitud_Click() {
    
    if (this.selection.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione por lo menos un registro");
      return;
    }
    if (this.selection.selected.length > 1) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione solo una solicitud para restaurar su estado");
      return;
    }
    var listaEstado = await this.solicitudesService.getListarNuevosEstado(this.selection.selected[0].IdEstado);
    if (listaEstado.ListaEntidadComun.length == 0) {
      this.bootstrapNotifyBarService.notifyWarning("Esta solicitud no tiene estados anteriores para restaurar");
      return;
    }

    this.dialogo.open(DialogoRestaurarSolicitudComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdsSolicitud: this.selection.selected.map(x => { return x.Id }).join(","),
        titulo: `Resturar Estado de la Solicitud de Trabajo`,
        codigoSolicitud: this.selection.selected[0].Codigo,
        IdEstadoActual: this.selection.selected[0].IdEstado,
        estadoActual: this.selection.selected[0].EstadoCompleto// + " " + (this.datosSiniestro.SubEstado !== null ? "(" + this.datosSiniestro.SubEstado + ")" : "")
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {

        if (confirmado.respuesta) {
          var request = {
            lstSolicitud: confirmado.IdsSolicitud.split(",").map((x: any) => { return parseInt(x) }),
            IdEstado: confirmado.IdEstado
          }

          this.solicitudesService.postRestaurarEstado(request).then((responseInmuble) => {

            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.selection.clear();
            }
            if (responseInmuble.TipoResultado == 2) {
              this.bootstrapNotifyBarService.notifyWarning(responseInmuble.Mensaje);
            }
          });
        }
      });
  }

  btnAnularSolicitud_Click() {
    
    if (this.selection.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione por lo menos un registro");
      return;
    }
    if (this.selection.selected.filter(x=> {return x.IdEstado ===7}).length > 0) { //Filtrara si estamos seleccionando solicitudes anuladas
      this.bootstrapNotifyBarService.notifyWarning("Algunas solicitudes seleccionadas estan ya Anulada");
      return;
    }
    this.dialogo.open(DialogoAnularSolicitudComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdsSolicitud: this.selection.selected.map(x => { return x.Id }).join(","),
        titulo: `Motivo Anulación`,
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if (confirmado.respuesta) {
          var request = {
            lstSolicitud: confirmado.IdsSolicitud.split(",").map((x: any) => { return parseInt(x) }),
            motivoAnulacion: confirmado.txtComentarioRechazo
          }
          this.solicitudesService.postAnularSolicitudes(request).then((responseInmuble) => {

            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.selection.clear();
            }
            if (responseInmuble.TipoResultado == 2) {
              this.bootstrapNotifyBarService.notifyWarning(responseInmuble.Mensaje);
            }
          });
        }
      });
  }

  btnCambiarTipoSolicitud_Click() {

    if (this.selection.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione por lo menos un registro");
      return;
    }
    if (this.selection.selected.length > 1) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione solo una solicitud para cambiar el tipo de solicitud");
      return;
    }

    this.dialogo.open(DialogoCambiarTipoSolicitudComponent, {
      maxWidth: '40vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '40%',
      disableClose: true,
      data: {
        IdsSolicitud: this.selection.selected.map(x => { return x.Id }).join(","),
        titulo: `Cambio del Tipo de Solicitud`,
        codigoSolicitud: this.selection.selected[0].Codigo,
        tipoSolicitud: this.selection.selected[0].NombreTipoSolicitud,
        IdCliente: this.selection.selected[0].IdCliente
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if (confirmado.respuesta) {

          var request = {
            IdSolicitud: parseInt(confirmado.IdsSolicitud),
            IdTipoSolicitud: confirmado.IdTipoSolicitud
          }

          this.solicitudesService.postCambiarTipoSolicitud(request).then((responseInmuble) => {

            if (responseInmuble.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(responseInmuble.Mensaje);
              this.selection.clear();
            }
            if (responseInmuble.TipoResultado == 2) {
              this.bootstrapNotifyBarService.notifyWarning(responseInmuble.Mensaje);
            }
          });
        }
      });
  }


  sumarDias(fecha: Date, dias: number) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }
  public onCheckedChangedRequerimiento(arg: MatCheckboxChange) {
    this._filtro.AplicaRequerimientosRechazados = arg.checked;
  }

  public onCheckedChangedPresupuesto(arg: MatCheckboxChange) {
    this._filtro.AplicaPresupuestosRechazados = arg.checked;
  };

  public onCheckedChangedConMateriales(arg: MatCheckboxChange) {
    this._filtro.ConMateriales = arg.checked;
  }

  public onCheckedChangedConTarifados(arg: MatCheckboxChange) {
    this._filtro.ConTarifados = arg.checked;
  };

  recibiRespuestaCliente(event: any): void {
    this._filtroLocalStoreage.ClienteDefault = event;
    this._filtro.IdsCliente = event.map((x: any) => { return x.Id });
  }
  recibiRespuestaInmueble(event: any): void {
    this._filtro.IdsInmueble = event.map((x: any) => { return x.Id });
  }
  recibiRespuestaSolicitante(event: any): void {
    this._filtro.IdsSolicitante = event.map((x: any) => { return x.Id });
  }
  recibiRespuestaProveedor(event: any): void {
    this._filtro.IdsProveedor = event.map((x: any) => { return x.Id });
  }
  recibiRespuestaEstadoSol(event: any): void {
    this._filtro.IdsEstadoSolictud = event.map((x: any) => { return x.Id });
  }
  recibiRespuestaZonal(event: any): void {
    this._filtro.IdsZonal = event.map((x: any) => { return x.Id });
  }
  recibiRespuestaTipoSolicitud(event: any): void {
    this._filtro.IdsTipoSolicitud = event.map((x: any) => { return x.Id });
  }
  recibiRespuestaInspector(event: any): void {
    this._filtro.IdsInspector = event.map((x: any) => { return x.Id });
  }
  recibiRespuestaGrupoUnidad(event: any): void {
    this._filtro.IdsGrupos = event.filter((x: any) => { return x.Grupo !== null }).map((x: any) => { return parseInt(x.Id) });
    this._filtro.IdsUnidades = event.filter((x: any) => { return x.Unidad !== null }).map((x: any) => { return parseInt(x.Id) });
  }
  LimpiarControles() {
    this._filtro.IdsCliente = [];
    this._filtro.IdsGrupoUnidad = [];
    this._filtro.IdsInmueble = [];
    this._filtro.IdsSolicitante = [];
    this._filtro.IdsProveedor = [];
    this._filtro.IdsInspector = [];
    this._filtro.IdsTipoSolicitud = [];
    this._filtro.IdsZonal = [];
    this._filtro.IdsEstadoSolictud = [];
    this._filtro.Codigo = '';
    this._filtro.CodigoExternoCliente = '';
    this._filtro.CodigoOrdenTrabajo = '';
    this._filtro.AplicaRequerimientosRechazados = false;
    this._filtro.AplicaPresupuestosRechazados = false;
    this._filtro.ConMateriales = false;
    this._filtro.ConTarifados = false;
    this._filtro.FechaRegDesde = "";
    this._filtro.FechaRegHasta = "";
    this.listClienteSeteado = [];
    this.listSolicitanteSeteado = [];
  }

  //#region Deserializer get encriptado
  fromBinary(binary: string) {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const charCodes = new Uint16Array(bytes.buffer);
    let result = '';
    for (let i = 0; i < charCodes.length; i++) {
      result += String.fromCharCode(charCodes[i]);
    }
    return result;
  }
  loadDatos(): void {

    if (!moment.isDate(this._filtro.FechaRegHasta)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha fin incorrecto.");
      return;
    }
    if (!moment.isDate(this._filtro.FechaRegDesde)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha inicio incorrecto.");
      return;
    }
    if (this._filtro.FechaRegHasta == null || this._filtro.FechaRegDesde == null) {
      this.bootstrapNotifyBarService.notifyWarning("Ingrese rango de fechas.");
      return;
    }

    var request = {
      NumeroPagina: this.currentPage,
      TamanioPagina: this.itemsPerPage,
      IdsClientes: this._filtro.IdsCliente,
      IdsGrupos: this._filtro.IdsGrupos === undefined ? [] : this._filtro.IdsGrupos,
      IdsUnidades: this._filtro.IdsUnidades === undefined ? [] : this._filtro.IdsUnidades,
      IdsInmuebles: this._filtro.IdsInmueble,
      IdsEstados: this._filtro.IdsEstadoSolictud,
      IdsInspectorFm: this._filtro.IdsInspector,
      IdsTipoSolicitud: this._filtro.IdsTipoSolicitud,
      ConMateriales: this._filtro.ConMateriales,
      ConTarifados: this._filtro.ConTarifados,
      IdSolicitante: this._filtro.IdsSolicitante.length == 0 ? 0 : this._filtro.IdsSolicitante[0],
      IdProveedor: this._filtro.IdsProveedor.length == 0 ? null : this._filtro.IdsProveedor[0],
      Codigo: this._filtro.Codigo.trim(),
      IdsZonales: this._filtro.IdsZonal,
      SortExpression: "",
      SortDirection: "",
      AplicaRequerimientosRechazados: this._filtro.AplicaRequerimientosRechazados,
      AplicaPresupuestosRechazados: this._filtro.AplicaPresupuestosRechazados,
      CodigoOrdenTrabajo: this._filtro.CodigoOrdenTrabajo.trim(),
      CodigoExternoCliente: this._filtro.CodigoExternoCliente,
      FechaRegDesde: this._filtro.FechaRegDesde === "" ? null : this.datePipe.transform(this._filtro.FechaRegDesde, 'yyyy-MM-dd'),
      FechaRegHasta: this._filtro.FechaRegHasta === "" ? null : this.datePipe.transform(this._filtro.FechaRegHasta, 'yyyy-MM-dd')
    }
    this.isLoading = true;
    this.dataSource = [];
    this.matexpansionpanelfiltro = false;

    this.solicitudesService.ListarSolicitudConsultaRestaurarEstadoPaginado(request).then((res) => {
      this.isLoading = false;
      var respuesta = JSON.parse(res);      
      this.datosAcciones = {
        mostrarAnular : respuesta.mostrarAnular,
        mostrarCambiarTipoSolicitud : respuesta.mostrarCambiarTipoSolicitud,
        mostrarRestaurarEstado : respuesta.mostrarRestaurarEstado,
      }
      respuesta.respuesta.forEach((element: any) => {
        var IconEstado = "";
        var EstadoCompleto = "";
        if (element.NombreSubEstado != undefined)
          EstadoCompleto = element.NombreEstadoSolicitud + "\n(" + element.NombreSubEstado + ")";
        else
          EstadoCompleto = element.NombreEstadoSolicitud

        if (element.IdEstado == eEstadoSolicitud.PendienteFranqueo)
          IconEstado = "icon-sol-PendienteFranqueo";
        if (element.IdEstado == eEstadoSolicitud.Anulada)
          IconEstado = "icon-sol-Anulada";
        if (element.IdEstado == eEstadoSolicitud.Ejecucion && this.fechaHoy < new Date(element.FechaEstimadaAtencion))
          IconEstado = "icon-sol-Ejecucion-verde";
        if (element.IdEstado == eEstadoSolicitud.Ejecucion && this.RestarDias(new Date(element.FechaEstimadaAtencion), 1) < this.fechaHoy)
          IconEstado = "icon-sol-Ejecucion-amarillo";
        if (element.IdEstado == eEstadoSolicitud.Ejecucion && this.fechaHoy > new Date(element.FechaEstimadaAtencion))
          IconEstado = "icon-sol-Ejecucion-rojo";
        if (element.IdEstado == eEstadoSolicitud.Ejecucion && element.FechaEstimadaAtencion == null)
          IconEstado = "icon-sol-Ejecucion-blanca";
        if (element.IdEstado == eEstadoSolicitud.Franqueada)
          IconEstado = "icon-sol-Franqueada";
        if (element.IdEstado == eEstadoSolicitud.Programacion)
          IconEstado = "icon-sol-Programacion";
        if (element.IdEstado == eEstadoSolicitud.Facturacion)
          IconEstado = "icon-sol-Facturacion";
        if (element.IdEstado == eEstadoSolicitud.PendienteAprobarPresupuesto
          || element.IdEstado == eEstadoSolicitud.PendienteAprobarReq)
          IconEstado = "icon-sol-pendiente_aprobacion";
        if (element.IdEstado == eEstadoSolicitud.ElaborarPresupuesto)
          IconEstado = "icon-sol-elaboracion_presupuesto";
        element.IconEstado = IconEstado;
        element.EstadoCompleto = EstadoCompleto;
      });
      this.dataSource = respuesta.respuesta;
      this.totalRegistros = respuesta.total;
    });
  }
  AumentarDias(date: any, days: any) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  RestarDias(date: any, days: any) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  pageChanged(event: any): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.loadDatos();
  };
  //#endregion

  ngOnDestroy(): void {
    localStorage.setItem('_filtroLocalStoreageSolicitudes', JSON.stringify(this._filtroLocalStoreage));
  }

  ngOnInit(): void {
    this.datosEdi = JSON.parse(this._authService.accessEdi);


    var objetoClientePorUsuario = JSON.parse(this.cookieService.get('objetoClientePorUsuario'));
    if (objetoClientePorUsuario != null) {
      this.listClienteSeteado = [];
      this.listClienteSeteado.push(objetoClientePorUsuario);
    }
    /*else {
      this.listClienteSeteado.push({
        Id: this.datosEdi.ClienteDefault.Id,
        Nombre: this.datosEdi.ClienteDefault.Nombre,
        NombreCorto: this.datosEdi.ClienteDefault.NombreCorto,
        NumeroDocumento: ''
      });
    }*/

    /*
    this.listClienteSeteado.push({
      Id: this.datosEdi.ClienteDefault.Id,
      Nombre: this.datosEdi.ClienteDefault.Nombre,
      NombreCorto: this.datosEdi.ClienteDefault.NombreCorto,
      NumeroDocumento: ''
    });*/

    this._filtro.IdsCliente = this.listClienteSeteado.map((x: any) => { return x.Id });
    this.listSolicitanteSeteado = [];
    this.listSolicitanteSeteado.push({
      Id: this.datosEdi.Id,
      Nombre: this.datosEdi.Nombre + " " + this.datosEdi.ApellidoPaterno + " " + this.datosEdi.ApellidoMaterno
    });
    this.loadDatos();
  }
}
