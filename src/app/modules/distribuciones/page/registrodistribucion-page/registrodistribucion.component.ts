import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { DistribucionesService } from '../../services/distribuciones.service';
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../../../core/auth/auth.service";
import { ChecklistDatabaseInmueble } from "../../services/ChecklistDatabaseInmueble.service";
import { ChecklistDatabaseGrupoMantenimiento } from "@modules/solicitudes/services/ChecklistDatabaseGrupoMantenimiento.service";
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { DialogoCargaMasivaDistribucionComponent } from "@shared/components/dialogo-cargamasivadistribucion/dialogo-cargamasivadistribucion.component";
import { DialogoCargaMasivaDistribucionOtrosComponent } from "@shared/components/dialogo-cargamasivadistribucionotro/dialogo-cargamasivadistribucionotro.component";
import { ClienteService } from '@shared/services/cliente.service';
import { ListavaloresService } from '@shared/services/listavalores.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DialogoConfirmacionComponent } from '@shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { DialogoRechazarDistribucionComponent } from "@shared/components/dialogo-rechazardistribucion/dialogo-rechazardistribucion.component";
import { RptDistribucionExcelService } from "../../services/RptDistribuciones.service";
import { MatSelect } from '@angular/material/select';
import { Chart, registerables } from 'chart.js';
const _ = require('lodash');
Chart.register(...registerables);
export interface Items {
  Id: number,
  Destino: string,
  Item: string,
  Cantidad: number,
  IdUnidadMedida: number,
  UnidadMedida: string,
}

export interface permisos {
  AprobarRechazar: boolean,
  PermiteAnularTicket: boolean,
}


export interface Ticket {
  Id: number
  Codigo: string
  Estado: string
  IdSolicitante: number
  Solicitante: string
  IdDestinatario: number
  Email: string
  Celular: string
  FechaRegistro: string
  UbicacionSolicitante: string
  DescripcionItem: string
  FechaDisponibilidad: Date
  TipoServicio: string
  Prioridad: string
  FechaEstimadaAtencion: any
  IdUnidadOrganizativa: number
  TipoOrigen: string
  TipoDestino: string
  TipoPaquete: string
  IdTipoOrigen: number
  IdTipoDestino: number
  IdPrioridad: number
  IdTipoServicio: number
  IdTipoPaquete: number
  IdEstado: number
  IdProveedor: any
  Proveedor: any
  CelularPersonaContacto: string
  NombrePersonaContacto: string
  CorreoPersonaContacto: string
}

export interface ordenesdto {
  Id: number,
  Codigo: string,
  Glosa: string,
  IdEstado: number,
  Estado: string,
  Origen: string,
  DireccionOrigen: string,
  UbigeoOrigen: string,
  Destino: string,
  DireccionDestino: string,
  UbigeoDestino: string,
  FechaEstimadaEntrega: null,
  FechaDespacho: null,
  AplicaEvaluacionCumplimiento: false,
  Cumplio: number,
  NoCumplio: number,
  FechaDisponible?: Date,
  LatitudDestino: string,
  LongitudDestino: string,
  ReferenciaDestino: string,
  DireccionMapaDestino: string,
  LatitudOrigen: string,
  LongitudOrigen: string,
  ReferenciaOrigen: string,
  DireccionMapaOrigen: string
}
const ELEMENT_DATA: Items[] = [

];
@Component({
  selector: 'app-registrodistribucion-page',
  templateUrl: './registrodistribucion.component.html',
  styleUrls: ['./registrodistribucion.component.css'],
  providers: [ChecklistDatabaseInmueble, ChecklistDatabaseGrupoMantenimiento]
})
export class RegistroDistribucionComponent implements OnInit, OnDestroy {  
  @ViewChild('cboPrioidad') cboPrioidad!: MatSelect;
  @ViewChild('cboTipoPaquete') cboTipoPaquete!: MatSelect;
  @ViewChild('cbosedeOrigen') cbosedeOrigen!: MatSelect;
  @ViewChild('cbosedeDestino') cbosedeDestino!: MatSelect;
  contentLoaded: boolean = false;
  canvasOrdenesKilos: any;
  ctxOrdenesKilos: any;
  @ViewChild('rpt1') pieCanvasOrdenesKilos!: { nativeElement: any };
  pieChartOrdenesKilos: any;

  porcentaje_val: any;
  porcentaje_txt: any;
  matexpansionpaneldatosgenerales: boolean = false;
  ordenesMatTableDataSource = new MatTableDataSource<ordenesdto>();
  ticket!: Ticket;
  permisos: permisos = {
    AprobarRechazar: false,
    PermiteAnularTicket: false
  };
  //dataDistribucion: any;
  ticketId: any;
  origen_list: any = [];
  destino_list: any = [];
  datosDistribucion = {
    sol: {
      usuario_destino: {
        Id: 0
      },
      direccion_origen: "",
      direccion_destino: "",
      descripcion: "",
      disponibilidad: new Date(),
      CelularPersonaContacto: "",
      NombrePersonaContacto: "",
      CorreoPersonaContacto: "",
      sedeOrigen: {
        Id: 0
      },
      sedeDestino: {
        Id: 0
      },
      tiposervicio: {
        Id: 0
      },
      prioridad: {
        Id: 0
      },
      centrocosto: {
        Id: 0
      },
      proveedor: {
        Id: 0
      },
      tipopaquete: {
        Id: 0
      },
      origen: {
        Id: 0,
        LatitudOrigen: "",
        LongitudOrigen: "",
        ReferenciaOrigen: "",
        DireccionMapaOrigen: "",
      },
      destino: {
        Id: 0,
        DireccionMapaDestino: "",
        FechaDisponible: "",
        LatitudDestino: "",
        LongitudDestino: "",
        ReferenciaDestino: "",
      },

    },

  }
  progressRef!: NgProgressRef;
  clienteMaster: number = 0;
  value: number = 0;
  mode = new UntypedFormControl('side');
  isLoading = false;
  //isSubmitted: boolean = false;
  datosBasicosItemFormGroup!: UntypedFormGroup;
  displayedColumns: string[] =
    [
      'Destino',
      'Descripcion',
      'Cantidad',
      'UndMed',
      'Accion'
    ];
  displayedColumnsDistribucion: string[] =
    [
      'estado',
      'CodigoOE',
      'Glosa',
      'Origen',
      'DireccionOrigen',
      'Destino',
      'DireccionDestino',
      'FechaEstimadaEntrega',
      'FechaRealEntrega'
    ];
  listAgenciaOrigen: any[] = [];
  listAgenciaDestino: any[] = [];
  listTipoServicio: any[] = [];
  listProveedor: any[] = [];
  listLogs: any[] = [];
  listPrioridad: any[] = [];
  listTipoOrigen: any[] = [];
  listTipoPaquete: any[] = [];
  listCentroCosto: any[] = [];
  listUnidadMedida: any[] = [];
  UsuarioDestino: any[] = [];
  bloquearTodo: boolean = true;
  mensajeBloqueo: string = "";
  // $scope.SedeOrigen = [];
  // $scope.SedeDestino = [];

  listOrigen: any[] = [];
  listDestino: any[] = [];
  dataSourceItems = ELEMENT_DATA;
  datosEdi: any = {};
  @ViewChild('tableItem') tableItem!: MatTable<any>;
  constructor(
    private rptDistribucionExcelService: RptDistribucionExcelService,
    private route: ActivatedRoute,
    public clienteService: ClienteService,
    public router: Router,
    private ngProgress: NgProgress,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    public dialogo: MatDialog,
    private distribucionesService: DistribucionesService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private listavaloresService: ListavaloresService
  ) {
    //this.dataSource = new MatTableDataSource(this.items);
    /*Cada vez que existe un cambio  en el objeto cartEvent se suscribira para que realizo un accion */
    clienteService.cartEvent$.subscribe((value) => {
      console.log(value);
      this.clienteMaster = value.Id;
      this.ngOnInit();
    });
  }
  Cancelar() {
    this.router.navigate(['/distribucion/consultasolicitudes']);
  }
  btnCargaMasivaDistribucion() {
    this.dialogo.open(DialogoCargaMasivaDistribucionComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        titulo: `Carga Masiva Distribución`,
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        // if (confirmado.respuesta) {
        //   this.datosBasicosFormGroup.patchValue({
        //     aprobadoresSolicitudCtrl: confirmado.aprobadoresSeleccionado.length === 0 ? [] : confirmado.aprobadoresSeleccionado.map((x: any) => { return x.Id })
        //   });
        // }
      });
  }

  btnCargaMasivaDistribucionOtros() {
    this.dialogo.open(DialogoCargaMasivaDistribucionOtrosComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        titulo: `Carga Masiva Distribución Otros`,
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
      });
  }

  ngOnDestroy(): void {
    this.ngProgress.destroyAll();
  }
  btnEliminarItem(item: any) {
    var ObjectIndex = this.dataSourceItems.findIndex(function (obj) { return obj.Id == item.Id; });//Obtenemos el Index del List de Objetos        
    if (ObjectIndex != -1) {
      this.dataSourceItems.splice(ObjectIndex, 1);
    }
    this.tableItem.renderRows();
  }
  btnAgregarItem() {
    if (!this.datosBasicosItemFormGroup.valid)
      return;
    this.dataSourceItems.push({
      Id: new Date().getTime(),
      Destino: "",
      Item: this.datosBasicosItemFormGroup.value.descripcionCtrl,
      Cantidad: this.datosBasicosItemFormGroup.value.cantidadCtrl,
      IdUnidadMedida: this.datosBasicosItemFormGroup.value.unidadMedidaCtrl.Id,
      UnidadMedida: this.datosBasicosItemFormGroup.value.unidadMedidaCtrl.Nombre,
    });
    this.tableItem.renderRows();
  }

  btnGrabar() {

    let _otros = false;
    let _multiples_origenes = false;
    let _multiples_destinos = false;
    if (this.datosDistribucion.sol.prioridad.Id == 0) {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe seleccionar una prioridad.');
      this.cboPrioidad.focus();
      return;
    }
    if (this.datosDistribucion.sol.tipopaquete.Id == 0) {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe seleccionar Tipo de Paquete.');
      this.cboTipoPaquete.focus();
      return;
    }
    if (this.datosDistribucion.sol.CorreoPersonaContacto !== undefined) { //Si es Recojo
      if (this.datosDistribucion.sol.CorreoPersonaContacto !== "") {
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(this.datosDistribucion.sol.CorreoPersonaContacto))
          console.log("correo valido");
        else {
          this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe ingresar correo valido.');
          return;
        }
      }
    }

    if ((this.datosDistribucion.sol.tiposervicio.Id === 343 || this.datosDistribucion.sol.tiposervicio.Id === 344) && this.datosDistribucion.sol.origen.Id === 347 && (this.datosDistribucion.sol.origen.DireccionMapaOrigen === "")) { //Si es Recojo
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe seleccionar ubicacion origen.');
      return;
    }

    if (this.datosDistribucion.sol.tiposervicio.Id === 343 && this.datosDistribucion.sol.destino.Id === 347 && (this.datosDistribucion.sol.destino.DireccionMapaDestino === "")) { //Si es Recojo
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe seleccionar ubicacion destino.');
      return;
    }
    if (this.datosDistribucion.sol.sedeOrigen && this.datosDistribucion.sol.sedeDestino) {
      if (this.datosDistribucion.sol.sedeOrigen.Id === this.datosDistribucion.sol.sedeDestino.Id) {
        this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'El origen y destino no pueden ser iguales!');
        this.cbosedeOrigen.focus();
        this.cbosedeDestino.focus();
        return;
      }
    } else {
      _otros = true;
    }

    if (this.datosDistribucion.sol.tiposervicio.Id === 344 && this.datosDistribucion.sol.sedeDestino === undefined) {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Datos del destino se encuentran incompletos!');
      return;
    }
    if (this.datosDistribucion.sol.sedeOrigen && this.datosDistribucion.sol.sedeOrigen.Id === 0) {
      _multiples_origenes = true;
    }
    if (this.datosDistribucion.sol.sedeDestino && this.datosDistribucion.sol.sedeDestino.Id === 0) {
      _multiples_destinos = true;
    }
    if (_multiples_origenes || _multiples_destinos || (this.dataSourceItems.length > 0)) {
      /*Revisar */
      // if (this.datosDistribucion.sol.tiposervicio.Id === 344) {//Tipo envio recojo
      //   const respuesta = await $scope.validarGrabarSolicitudDistribucion();
      //   if (!respuesta) return;
      // }


      var req = {
        IdCliente: 62,
        DescripcionItem: this.datosDistribucion.sol.descripcion,
        FechaDisponibilidad: this.datosDistribucion.sol.disponibilidad,
        IdTipoServicio: this.datosDistribucion.sol.tiposervicio.Id,
        IdPrioridad: this.datosDistribucion.sol.prioridad.Id,
        IdUnidadOrganizativa: this.datosDistribucion.sol.centrocosto ? this.datosDistribucion.sol.centrocosto.Id : undefined,
        IdTipoPaquete: this.datosDistribucion.sol.tipopaquete.Id,
        IdTipoOrigen: this.datosDistribucion.sol.origen.Id,
        IdTipoDestino: this.datosDistribucion.sol.destino.Id,
        IdDestinatario: this.datosDistribucion.sol.usuario_destino ? this.datosDistribucion.sol.usuario_destino.Id : undefined,
        CelularPersonaContacto: this.datosDistribucion.sol.CelularPersonaContacto,
        NombrePersonaContacto: this.datosDistribucion.sol.NombrePersonaContacto,
        CorreoPersonaContacto: this.datosDistribucion.sol.CorreoPersonaContacto,
        Ordenes: {}
      };

      if (this.datosDistribucion.sol.origen.Id === 347 || this.datosDistribucion.sol.destino.Id === 347) {
        //ORIGEN DESTINO OTROS
        req.Ordenes = [{
          IdOrigen: this.datosDistribucion.sol.sedeOrigen ? this.datosDistribucion.sol.sedeOrigen.Id : null,
          //IdUbigeoOrigen: $scope.sol.ubigeo_origen ? $scope.sol.ubigeo_origen.Id : null,
          IdUbigeoOrigen: null,
          DireccionOrigen: this.datosDistribucion.sol.direccion_origen ? this.datosDistribucion.sol.direccion_origen : '',
          IdDestino: this.datosDistribucion.sol.sedeDestino ? this.datosDistribucion.sol.sedeDestino.Id : null,
          //IdUbigeoDestino: $scope.sol.ubigeo_destino ? $scope.sol.ubigeo_destino.Id : null,
          IdUbigeoDestino: null,
          DireccionDestino: this.datosDistribucion.sol.direccion_destino ? this.datosDistribucion.sol.direccion_destino : '',
          Items: this.dataSourceItems.map(x => {
            return {
              Item: x.Item,
              IdUnidadMedida: x.IdUnidadMedida,
              Cantidad: x.Cantidad
            }
          }),
          /*Destino*/
          LatitudDestino: this.datosDistribucion.sol.destino.LatitudDestino ? this.datosDistribucion.sol.destino.LatitudDestino : '',
          LongitudDestino: this.datosDistribucion.sol.destino.LongitudDestino ? this.datosDistribucion.sol.destino.LongitudDestino : '',
          ReferenciaDestino: this.datosDistribucion.sol.destino.ReferenciaDestino ? this.datosDistribucion.sol.destino.ReferenciaDestino : '',
          DireccionMapaDestino: this.datosDistribucion.sol.destino.DireccionMapaDestino ? this.datosDistribucion.sol.destino.DireccionMapaDestino : '',
          /*Origen*/
          LatitudOrigen: this.datosDistribucion.sol.origen.LatitudOrigen ? this.datosDistribucion.sol.origen.LatitudOrigen : '',
          LongitudOrigen: this.datosDistribucion.sol.origen.LongitudOrigen ? this.datosDistribucion.sol.origen.LongitudOrigen : '',
          ReferenciaOrigen: this.datosDistribucion.sol.origen.ReferenciaOrigen ? this.datosDistribucion.sol.origen.ReferenciaOrigen : '',
          DireccionMapaOrigen: this.datosDistribucion.sol.origen.DireccionMapaOrigen ? this.datosDistribucion.sol.origen.DireccionMapaOrigen : '',
          //FechaDisponible: this.datosDistribucion.sol.destino.FechaDisponible ? moment(this.datosDistribucion.sol.destino.FechaDisponible) : null,
        }];
      } else {
        // if (this.datosDistribucion.sol.sedeOrigen.Id === 0) {
        //   _.forEach(this.datosDistribucion.ordenesPorCargaOrigen, function (val) {
        //     val.IdDestino = this.datosDistribucion.sol.sedeDestino.Id;
        //   });
        //   req.Ordenes = $scope.ordenesPorCargaOrigen;
        // } else if (this.datosDistribucion.sol.sedeDestino.Id === 0) {
        //   _.forEach($scope.ordenesPorCargaDestino, function (val) {
        //     val.IdOrigen = $scope.sol.sedeOrigen.Id;
        //   });
        //   req.Ordenes = $scope.ordenesPorCargaDestino;
        // } else {

        req.Ordenes = [{
          IdOrigen: this.datosDistribucion.sol.sedeOrigen.Id,
          //IdUbigeoOrigen: $scope.sol.ubigeo_origen ? $scope.sol.ubigeo_origen.Id : null,
          IdUbigeoOrigen: null,
          DireccionOrigen: this.datosDistribucion.sol.direccion_origen ? this.datosDistribucion.sol.direccion_origen : '',
          IdDestino: this.datosDistribucion.sol.sedeDestino.Id,
          //IdUbigeoDestino: $scope.sol.ubigeo_destino ? $scope.sol.ubigeo_destino.Id : null,
          IdUbigeoDestino: null,
          DireccionDestino: this.datosDistribucion.sol.direccion_destino ? this.datosDistribucion.sol.direccion_destino : '',
          Items: this.dataSourceItems.map(x => {
            return {
              Item: x.Item,
              IdUnidadMedida: x.IdUnidadMedida,
              Cantidad: x.Cantidad
            }
          }),
          /*Destino*/
          LatitudDestino: this.datosDistribucion.sol.destino.LatitudDestino ? this.datosDistribucion.sol.destino.LatitudDestino : '',
          LongitudDestino: this.datosDistribucion.sol.destino.LongitudDestino ? this.datosDistribucion.sol.destino.LongitudDestino : '',
          ReferenciaDestino: this.datosDistribucion.sol.destino.ReferenciaDestino ? this.datosDistribucion.sol.destino.ReferenciaDestino : '',
          DireccionMapaDestino: this.datosDistribucion.sol.destino.DireccionMapaDestino ? this.datosDistribucion.sol.destino.DireccionMapaDestino : '',
          /*Origen*/
          LatitudOrigen: this.datosDistribucion.sol.origen.LatitudOrigen ? this.datosDistribucion.sol.origen.LatitudOrigen : '',
          LongitudOrigen: this.datosDistribucion.sol.origen.LongitudOrigen ? this.datosDistribucion.sol.origen.LongitudOrigen : '',
          ReferenciaOrigen: this.datosDistribucion.sol.origen.ReferenciaOrigen ? this.datosDistribucion.sol.origen.ReferenciaOrigen : '',
          DireccionMapaOrigen: this.datosDistribucion.sol.origen.DireccionMapaOrigen ? this.datosDistribucion.sol.origen.DireccionMapaOrigen : '',
          //FechaDisponible: this.datosDistribucion.sol.destino.FechaDisponible ? moment(this.datosDistribucion.sol.destino.FechaDisponible) : null,
        }];

        this.dialogo.open(DialogoConfirmacionComponent, {
          maxWidth: '25vw',
          maxHeight: 'auto',
          height: 'auto',
          width: '25%',
          disableClose: true,
          data: {
            titulo: `Registro de Distribución`,
            mensaje: `Se grabara el registro de Distribución. Desea continuar?`
          }
        })
          .afterClosed()
          .subscribe(async (confirmado: Boolean) => {
            if (confirmado) {
              this.progressRef.start();              
              this.distribucionesService.grabarDistribucion(req).then((res) => {
                
                if (res.TipoResultado === 1) {
                  this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
                  this.obtenerTicketId(res.Id);
                } else this.bootstrapNotifyBarService.notifyDanger(res.Mensaje);
                this.progressRef.complete();                
              });
            }
          });
      }

    } else {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe de agregar items para el envio.');
    }
  }
  seleccionarTipoServicio(val: any) {
    
    //LIMPIAR
    this.limpiarOrigen();
    this.limpiarDestino();
    //ENVIO 343
    if (val === 343) {
      this.listOrigen.forEach(x => {
        if (x.Id !== 345) x.Disabled = true;
        else x.Disabled = false;
      });
    }
    //RECOJO 344
    if (val === 344) {
      this.listOrigen.forEach(x => {
        x.Disabled = false;
      });
    }
    //si envio solo agencia/almacen/otros
    //si recojo solo agencia - multi agencias/almacen/otros
  }

  limpiarOrigen() {
    this.listOrigen.forEach(x=>{x.Disabled=false});
    this.datosDistribucion.sol.origen = {
      Id: 0,
      DireccionMapaOrigen: "",
      LatitudOrigen: "",
      LongitudOrigen: "",
      ReferenciaOrigen: ""
    };
    this.datosDistribucion.sol.sedeOrigen = {
      Id: 0
    };
    //$scope.sol.ubigeo_origen = undefined;
    this.datosDistribucion.sol.direccion_origen = "";
    this.datosDistribucion.sol.CelularPersonaContacto = "";
    this.datosDistribucion.sol.NombrePersonaContacto = "";
    this.datosDistribucion.sol.CorreoPersonaContacto = "";
    this.listAgenciaOrigen = [];

  }
  limpiarDestino() {
    // _.forEach($scope.Destino, function (i) {
    //     i.Disabled = false;
    // });
    this.listDestino.forEach(x=>{x.Disabled=false});
    this.datosDistribucion.sol.destino = {
      DireccionMapaDestino: "",
      FechaDisponible: "",
      Id: 0,
      LatitudDestino: "",
      LongitudDestino: "",
      ReferenciaDestino: ""
    };
    this.datosDistribucion.sol.sedeDestino = {
      Id: 0
    };
    this.datosDistribucion.sol.direccion_destino = "";
    //AgenciaDestino = [];


  }

  seleccionarDestino(val: any) {

    this.datosDistribucion.sol.sedeDestino = {
      Id: 0
    };
    //$scope.SedeDestino = [];
    if (val === 345) {
      //ALMACEN : MOSTRAR LOS ALMACENES EN EL COMBO
      this.distribucionesService.obtenerAlmacenes(62).then((res) => {
        this.listAgenciaDestino = res;
      });
    } else if (val === 346) {
      //AGENCIA : caso que el tipo de Origen sea Sede principal : ObtenerInmueblePrincipal
      this.distribucionesService.obtenerAgencias(62, null).then((res) => {
        // $scope.AgenciaDestino = res.ListaInmueble;
        // $scope.AgenciaDestino.push({ Id: 0, Nombre: '--Multiple Destinos--' });
      });
    } else if (val === 347) {
      //OTROS
      //SOLO SE HABILITARA EL TEXTAREA DE DIRECCION
      // DISTRIBUCION.obtenerProveedores(62).then((res) => {
      //     $scope.SedeOrigen.push(res);
      // });
    } else {
      //otros habilitar el textarea direccion origen
    }
  }

  seleccionarSedeDestino(i: any) {

    this.distribucionesService.obtenerUsuariosPorInmueble(i).then((res) => {
      this.UsuarioDestino = res.ListaUsuarios;
    });
    var datoseleccionado = this.listAgenciaDestino.find(x => { return x.Id == i });
    this.datosDistribucion.sol.direccion_destino = datoseleccionado.Nombre2;
    //this.datosDistribucion.sol.direccion_destino = i.Nombre2;
  }

  seleccionarSedeOrigen(i: number) {

    var datoseleccionado = this.listAgenciaOrigen.find(x => { return x.Id == i });
    this.datosDistribucion.sol.direccion_origen = datoseleccionado.Nombre2;
  }
  async seleccionarOrigen(value: any) {
    debugger;
    //var respuesta = await this.distribucionesService.obtenerAgencias({ id: value }, this.selected);

    // $scope.sol.sedeOrigen = {};
    // $scope.SedeOrigen = [];
    // $scope.sol.direccion_origen = '';

    //tipo de servicio envio 343 recojo 344
    const tiposervicio = this.datosDistribucion.sol.tiposervicio;

    //origen almacen 345
    //origen agencia 346
    //origen otros 347
    
    //envio + almacen
    if (tiposervicio.Id === 343 && value === 345) {
      this.distribucionesService.obtenerAlmacenes(62).then((res) => {
        this.listDestino.forEach(x => {
          x.Disabled = false;
        });
        this.listAgenciaOrigen = res;
      });
    }

    //recojo + almacen
    if (tiposervicio.Id === 344 && value === 345) {
      this.distribucionesService.obtenerAlmacenes(62).then((res) => {
        this.listDestino.forEach(x => {
          if (x.Id !== 345) x.Disabled = true;
          else x.Disabled = false;
        });
        this.listAgenciaOrigen = res;
      });
    }
    //recojo + agencia
    if (tiposervicio.Id === 344 && value === 346) {
      this.distribucionesService.obtenerAgencias(62, null).then((res) => {
        this.listDestino.forEach(x => {
          if (x.Id !== 345) x.Disabled = true;
          else x.Disabled = false;
        });
        this.listAgenciaOrigen = res.ListaInmueble;
        if (this.datosDistribucion.sol.tiposervicio.Id === 344) {
          this.listAgenciaOrigen.push({
            Id: 0,
            Nombre: '--Multiple Origenes--'
          });
        }
      });
    }
    //recojo + otros
    if (tiposervicio.Id === 344 && value === 347) {
      this.listDestino.forEach(x => {
        if (x.Id !== 345) x.Disabled = true;
        else x.Disabled = false;
      });
    }
    console.log(this.listOrigen);
    console.log(this.listDestino);
  }
  btnVerDetalleOrdenes() {

  }
  btnExportarExcelOrdenes() {
    this.rptDistribucionExcelService.exportReport(this.ordenesMatTableDataSource.data, "ReporteOrdenesEntrega").then(() => {
      //location.reload()
    });
  }

  aprobar() {
    
    if (this.datosDistribucion.sol.centrocosto.Id == 0) {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe de seleccionar un centro de costo.');
      return;
    }
    if (this.datosDistribucion.sol.proveedor.Id == 0) {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe de seleccionar un proveedor.');
      return;
    }    
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Aprobación de Distribución`,
        mensaje: `Se Aprobara el registro de Distribución. Desea continuar?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          this.progressRef.start();
          
          var req = {
            IdDistribuciones: this.ticket.Id,
            Aprobar: true,
            IdProveedor: this.datosDistribucion.sol.proveedor.Id,
            IdUnidadOrganizativa: this.datosDistribucion.sol.centrocosto.Id
          };
          return this.distribucionesService.aprobarRechazar(req).then(async (res) => {
            
            if (res.TipoResultado == 1){
              this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
              this.contentLoaded=false;
              await this.obtenerTicketId(this.ticket.Id);
              this.contentLoaded=true;
            }              
            else this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
            this.progressRef.complete();
          });
        }
      });

  }
  rechazar() {

    this.dialogo.open(DialogoRechazarDistribucionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Rechazar de Distribución`,
        mensaje: `Se Rechazar el registro de Distribución. Desea continuar?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if (confirmado.respuesta) {
          this.progressRef.start();
          const req = {
            IdDistribuciones: this.ticket.Id,
            Aprobar: false,
            MotivoRechazo: confirmado.txtComentarioRechazo
          };
          return this.distribucionesService.aprobarRechazar(req).then(async (res) => {
            if (res.TipoResultado == 1){
              this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
              this.contentLoaded=false;
              await this.obtenerTicketId(this.ticket.Id);
              this.contentLoaded=true;
            }              
            else this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
            this.progressRef.complete();
          });
        }
      });

  }
  anular() {
    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Anular Registro de Distribución`,
        mensaje: `Se anulara el registro de Distribución. Desea continuar?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          this.progressRef.start();
          var req = {
            IdDistribuciones: this.ticketId
          };
          return this.distribucionesService.anularDistribucion(req).then(async (res) => {
            if (res.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
              this.contentLoaded=false;
              await this.obtenerTicketId(this.ticket.Id);
              this.contentLoaded=true;              
            } else this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
            this.progressRef.complete();
          });
        }

      });
  }
  calculoSla(total: any) {
    let _cumplio = total.filter((x: any) => { return x.Cumplio == 1 });
    let _nocumplio = total.filter((x: any) => { return x.NoCumplio == 1 });

    let res = {
      datasets: [{ backgroundColor: ['#007bff', '#EFEEEE'], data: [_cumplio.length, _nocumplio.length] }],
      labels: ['Cumplio', 'No Cumplio'],
      hoverOffset: 4
    };

    this.canvasOrdenesKilos = this.pieCanvasOrdenesKilos.nativeElement;
    this.ctxOrdenesKilos = this.canvasOrdenesKilos.getContext('2d');
    if (this.pieChartOrdenesKilos != null || this.pieChartOrdenesKilos !== undefined) {
      this.pieChartOrdenesKilos.destroy();
    }
    this.pieChartOrdenesKilos = new Chart(this.ctxOrdenesKilos, {
      type: 'pie',
      data: res,

      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: -30,
            bottom: 0
          }
        },
        plugins: {

          legend: {
            display: true,
            align: 'center',
            position: 'right'
          },
        }
      }
    });
  }
  async obtenerTicketId(valor: number) {
    var respuestaTicket = await this.distribucionesService.obtenerTicketId(valor);
    if (respuestaTicket.TipoResultado == 1) {
      var respuestaProveedor = await this.distribucionesService.obtenerProveedoresDistribucion(62);
      this.listProveedor = respuestaProveedor;

      console.log(respuestaTicket.data);
      this.ticket = respuestaTicket.data;
      this.permisos = respuestaTicket.permisos;
      console.log(this.permisos);
      //this.dataDistribucion = respuestaTicket.ListOrdenes;
      this.ordenesMatTableDataSource.data = respuestaTicket.ListOrdenes;

      //console.log(this.dataDistribucion);
      this.ticketId = this.ticket.Id;
      this.datosDistribucion.sol.CelularPersonaContacto = this.ticket.CelularPersonaContacto;
      this.datosDistribucion.sol.NombrePersonaContacto = this.ticket.NombrePersonaContacto;
      this.datosDistribucion.sol.CorreoPersonaContacto = this.ticket.CorreoPersonaContacto;
      this.datosDistribucion.sol.descripcion = this.ticket.DescripcionItem;
      this.datosDistribucion.sol.disponibilidad = this.ticket.FechaDisponibilidad;
      this.datosDistribucion.sol.tiposervicio.Id = this.ticket.IdTipoServicio;
      this.datosDistribucion.sol.prioridad.Id = this.ticket.IdPrioridad;
      this.datosDistribucion.sol.tipopaquete.Id = this.ticket.IdTipoPaquete;
      this.datosDistribucion.sol.centrocosto.Id = this.ticket?.IdUnidadOrganizativa;

      this.datosDistribucion.sol.origen.Id = this.ticket.IdTipoOrigen;
      this.datosDistribucion.sol.destino.Id = this.ticket.IdTipoDestino;
      
      this.datosDistribucion.sol.proveedor.Id = this.ticket.IdProveedor==null?0: this.ticket.IdProveedor;
      this.origen_list = respuestaTicket.ListOrdenes.map((x: any) => {
        return {
          Codigo: x.Codigo,
          Estado: x.Estado,
          Origen: x.Origen,
          DireccionOrigen: x.DireccionOrigen,
          LatitudOrigen: x.LatitudOrigen,
          LongitudOrigen: x.LongitudOrigen,
          ReferenciaOrigen: x.ReferenciaOrigen,
          DireccionMapaOrigen: x.DireccionMapaOrigen
        }
      });
      //					['Destino', 'DireccionDestino', 'UbigeoDestino', 'LatitudDestino', 'LongitudDestino', 'ReferenciaDestino', 'DireccionMapaDestino']));
      this.destino_list = respuestaTicket.ListOrdenes.map((x: any) => {
        return {
          Codigo: x.Codigo,
          Estado: x.Estado,
          Destino: x.Destino,
          DireccionDestino: x.DireccionDestino,
          UbigeoDestino: x.UbigeoDestino,
          LatitudDestino: x.LatitudDestino,
          LongitudDestino: x.LongitudDestino,
          ReferenciaDestino: x.ReferenciaDestino,
          DireccionMapaDestino: x.DireccionMapaDestino
        }
      });
      var total = respuestaTicket.ListOrdenes.length;
      var entregados = respuestaTicket.ListOrdenes.filter((x: any) => { return x.IdEstado == 357 });
      this.porcentaje_val = ((parseFloat(entregados.length) / parseFloat(total)) * 100).toFixed(2);
      this.porcentaje_txt = 'Porcentaje de ' + ((parseFloat(entregados.length) / parseFloat(total)) * 100).toFixed(2) + ' %';
      if (entregados.length > 0) this.calculoSla(entregados);
    }


    var respuestaLog = await this.distribucionesService.obtenerLogAcciones({
      tabla: 1008,
      entidad: this.ticketId
    });
    this.listLogs = respuestaLog;
    console.log(this.listLogs);

    var respuestaCentroCosto = await this.distribucionesService.obtenerCentroCosto(62);
    this.listCentroCosto = respuestaCentroCosto;
  }
  async ngOnInit() {
    this.matexpansionpaneldatosgenerales = true;
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.progressRef = this.ngProgress.ref();
    this.progressRef.state.subscribe((state: any) => {
      this.value = state.value;
    });

    this.datosBasicosItemFormGroup = this._formBuilder.group({
      descripcionCtrl: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      cantidadCtrl: ["", Validators.required],
      unidadMedidaCtrl: ["", Validators.required],
    });
    debugger;

    var respuestavalidarCalificacion = await this.distribucionesService.validarCalificacion();
    debugger;
    if (respuestavalidarCalificacion.TipoResultado === 1) {
      if (respuestavalidarCalificacion.Mensaje) this.bootstrapNotifyBarService.notifySuccess('Info Edi!' + respuestavalidarCalificacion.Mensaje);
    } else {
      debugger;
      if (this.ticket == undefined) {
        this.bloquearTodo = false;
        this.mensajeBloqueo = respuestavalidarCalificacion.Mensaje;
        this.bootstrapNotifyBarService.notifySuccess('Info Edi! ' + respuestavalidarCalificacion.Mensaje);
      }
    }

   
    console.log(this.ticket);
    let valor: any = this.route.snapshot.paramMap.get('id');
    if (parseInt(valor) != 0) {
      await this.getInit();
      await this.obtenerTicketId(parseInt(valor));
      this.contentLoaded = true;
    }else{
      await this.getInit();
      this.contentLoaded = true;
    }
  }
  async getInit(){
    
    var respuestaTipoServicio = await this.listavaloresService.getListaValores({ idlista: 180, idcliente: "" });
    if (respuestaTipoServicio.TipoResultado == 1)
      this.listTipoServicio = respuestaTipoServicio.ListaEntidadComun;

    var respuestaTipoOrigen = await this.listavaloresService.getListaValores({ idlista: 181, idcliente: "" });
    if (respuestaTipoOrigen.TipoResultado == 1) {
      this.listOrigen = _.cloneDeep(respuestaTipoOrigen.ListaEntidadComun); // Array.of(...respuestaTipoOrigen.ListaEntidadComun) ;//[...respuestaTipoOrigen.ListaEntidadComun] ;
      this.listDestino = _.cloneDeep(respuestaTipoOrigen.ListaEntidadComun); //Array.of(...respuestaTipoOrigen.ListaEntidadComun) ;//[...respuestaTipoOrigen.ListaEntidadComun];
    }
    var respuestaPrioridad = await this.listavaloresService.getListaValores({ idlista: 182, idcliente: "" });
    if (respuestaPrioridad.TipoResultado == 1)
      this.listPrioridad = respuestaPrioridad.ListaEntidadComun;

    var respuestaTipoPaquete = await this.listavaloresService.getListaValores({ idlista: 183, idcliente: "" });
    if (respuestaTipoPaquete.TipoResultado == 1)
      this.listTipoPaquete = respuestaTipoPaquete.ListaEntidadComun;

    var respuestaUnidadMedida = await this.listavaloresService.getListaValores({ idlista: 187, idcliente: "" });
    if (respuestaUnidadMedida.TipoResultado == 1) {
      this.listUnidadMedida = respuestaUnidadMedida.ListaEntidadComun;
      //   this.listUnidadMedida.sort(function (a, b) {
      //     return a.Nombre > b.Nombre;
      // });
    }
  }

  FinalizarRegistroSolicitud() {

  }


  //#endregion
}
