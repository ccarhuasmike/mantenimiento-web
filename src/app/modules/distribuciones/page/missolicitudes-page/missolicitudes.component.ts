import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DistribucionesService } from '../../services/distribuciones.service';
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
import { ListavaloresService } from '@shared/services/listavalores.service';
import { FormControl } from '@angular/forms';
export interface Acciones {
  mostrarAnular: boolean;
  mostrarCambiarTipoSolicitud: boolean;
  mostrarRestaurarEstado: boolean;

}

@Component({
  selector: 'app-missolicitudes',
  templateUrl: './missolicitudes.component.html',
  styleUrls: ['./missolicitudes.component.css'],
  providers: [CookieService]
})
export class MisSolicitudesComponent implements OnInit, OnDestroy {    
  listaEstado: any;
  
  matexpansionpanelfiltro: boolean = false;
  isLoading = false;
  public itemsPerPage: number = 10;
  public totalRegistros: number = 0;
  public currentPage: number = 0;
  listClienteSeteado: any = [];
  listSolicitanteSeteado: any = [];
  public dataSource: any;
  selection = new SelectionModel<any>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;  
  _filtroLocalStoreage: any = {};
  _filtro: any = {
    IdsSolicitante: [],
    Codigo: '',
    AgenciaOrigen: '',    
    IdEstado : 0,
    MostrarAnulados: false,    
    FechaRegDesde: this.sumarDias(new Date(), -7),
    FechaRegHasta: new Date()
  };
  visible = true;
  selectable = true;  
  addOnBlur = true;
  datosEdi: any = {};
  displayedColumns: string[] =
    [
      'select',
      'NroSolicitud',
      'TipoServicio',
      'Prioridad',
      'Solicitante',
      'Estado',
      'FRegistro',
      'FEstimada',
      'FEntrega'
    ];

  constructor(
    private listavaloresService: ListavaloresService,
    public dialogo: MatDialog,
    private _authService: AuthService,
    public clienteService: ClienteService,
    private distribucionesService: DistribucionesService,
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
    var listaEstado = await this.distribucionesService.getListarNuevosEstado(this.selection.selected[0].IdEstado);
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

          this.distribucionesService.postRestaurarEstado(request).then((responseInmuble: any) => {

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
    if (this.selection.selected.filter(x => { return x.IdEstado === 7 }).length > 0) { //Filtrara si estamos seleccionando solicitudes anuladas
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
          this.distribucionesService.postAnularSolicitudes(request).then((responseInmuble) => {

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

          this.distribucionesService.postCambiarTipoSolicitud(request).then((responseInmuble) => {

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
  public onCheckedChangedMostrarAnulados(arg: MatCheckboxChange) {
    this._filtro.MostrarAnulados = arg.checked;
  }

  recibiRespuestaSolicitante(event: any): void {
    this._filtro.IdsSolicitante = event.map((x: any) => { return x.Id });
  }
  LimpiarControles() {    
    this._filtro.IdsSolicitante = [];
    this._filtro.IdEstado = "";
    this._filtro.Codigo = '';   
    this._filtro.AgenciaOrigen  = '';      
    this._filtro.MostrarAnulados = false;    
    this._filtro.FechaRegDesde= this.sumarDias(new Date(), -7),
    this._filtro.FechaRegHasta= new Date()    
  }
  //#region Deserializer get encriptado
  loadDatos(): void {
    debugger;
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
      d: {
        datatable: {
          IdCliente: 62,
          Codigo: this._filtro.Codigo,
          IdSolicitante: 3647,
          IdEstado: this._filtro.IdEstado,//$scope.filtro.estado ? $scope.filtro.estado.Id : undefined,          
          FechaDesde: this._filtro.FechaRegDesde === "" ? "" :this._filtro.FechaRegDesde.toJSON(),
          FechaHasta: this._filtro.FechaRegHasta === "" ? "" :this._filtro.FechaRegHasta.toJSON()
        },
        draw: 1,
        length: this.itemsPerPage,
        start: this.currentPage
      }    
    }
    this.isLoading = true;
    this.dataSource = [];
    this.matexpansionpanelfiltro = false;
    this.distribucionesService.ListarPaginado(request).then((res) => {
      this.isLoading = false;
      this.dataSource = res.data;
      this.totalRegistros = res.recordsTotal;
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
    debugger;
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.loadDatos();
  };
  //#endregion

  ngOnDestroy(): void {
    localStorage.setItem('_filtroLocalStoreageSolicitudes', JSON.stringify(this._filtroLocalStoreage));
  }

  async ngOnInit() {
    var respuesta = await this.listavaloresService.getListaValores({
      idlista: 184,
      idcliente: ""
    });

    if (respuesta.TipoResultado == 1) {
      this.listaEstado = respuesta.ListaEntidadComun;
    }

    this.datosEdi = JSON.parse(this._authService.accessEdi);


    var objetoClientePorUsuario = JSON.parse(this.cookieService.get('objetoClientePorUsuario'));
    if (objetoClientePorUsuario != null) {
      this.listClienteSeteado = [];
      this.listClienteSeteado.push(objetoClientePorUsuario);
    }
    this._filtro.IdsCliente = this.listClienteSeteado.map((x: any) => { return x.Id });
    this.listSolicitanteSeteado = [];
    this.listSolicitanteSeteado.push({
      Id: this.datosEdi.Id,
      Nombre: this.datosEdi.Nombre + " " + this.datosEdi.ApellidoPaterno + " " + this.datosEdi.ApellidoMaterno
    });
    this.loadDatos();
  }
}
