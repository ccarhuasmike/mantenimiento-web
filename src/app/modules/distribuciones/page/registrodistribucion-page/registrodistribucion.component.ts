import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import {DialogoRechazarDistribucionComponent} from "@shared/components/dialogo-rechazardistribucion/dialogo-rechazardistribucion.component";
import { RptDistribucionExcelService } from "../../services/RptDistribuciones.service";

export interface Items {
  Id: number,
  Destino: string,
  Item: string,
  Cantidad: number,
  IdUnidadMedida: number,
  UnidadMedida: string,
}

export interface permisos {
  AprobarRechazar:boolean,
  PermiteAnularTicket:boolean,
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
  matexpansionpaneldatosgenerales: boolean = false;
  ordenesMatTableDataSource = new MatTableDataSource<ordenesdto>();
  ticket!: Ticket;
  permisos: permisos={
    AprobarRechazar:false,
    PermiteAnularTicket:false
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
  isSubmitted: boolean = false;
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
      /*this.cookieService.delete('objetoClientePorUsuario');
      this.cookieService.set('objetoClientePorUsuario', JSON.stringify(value));*/
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
      return;
    }
    if (this.datosDistribucion.sol.tipopaquete.Id == 0) {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe seleccionar Tipo de Paquete.');
      return;
    }

    // if ($scope.sol.CelularPersonaContacto === undefined || $scope.sol.CelularPersonaContacto === "") { //Si es Recojo
    //     toast.info('Info Edi!', 'Debe ingresar celular de contacto.');
    //     return;
    // }
    // if ($scope.sol.NombrePersonaContacto === undefined || $scope.sol.NombrePersonaContacto === "") { //Si es Recojo
    //     toast.info('Info Edi!', 'Debe ingresar nombre de contacto.');
    //     return;
    // }

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

    if ((this.datosDistribucion.sol.tiposervicio.Id === 343 || this.datosDistribucion.sol.tiposervicio.Id === 344) && this.datosDistribucion.sol.origen.Id === 347 && (this.datosDistribucion.sol.origen.DireccionMapaOrigen === undefined)) { //Si es Recojo
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe seleccionar ubicacion origen.');
      return;
    }

    if (this.datosDistribucion.sol.tiposervicio.Id === 343 && this.datosDistribucion.sol.destino.Id === 347 && (this.datosDistribucion.sol.destino.DireccionMapaDestino === undefined)) { //Si es Recojo
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe seleccionar ubicacion destino.');
      return;
    }
    if (this.datosDistribucion.sol.sedeOrigen && this.datosDistribucion.sol.sedeDestino) {
      if (this.datosDistribucion.sol.sedeOrigen.Id === this.datosDistribucion.sol.sedeDestino.Id) {
        this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'El origen y destino no pueden ser iguales!');
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
              console.log(JSON.stringify(req));
              this.distribucionesService.grabarDistribucion(req).then((res) => {
                if (res.TipoResultado === 1) {
                  this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
                  // DISTRIBUCION.obtenerTicketId(res.Id).then((res) => {
                  //     if (res.TipoResultado === 1) {
                  //         $scope.ticket = res.data;
                  //         $scope.permisos = res.permisos;
                  //         $scope.dataDistribucion = res.ListOrdenes;
                  //         $scope.ticketId = $scope.ticket.Id;
                  //     } else Swal.insertQueueStep(res.Mensaje);
                  // });
                } else this.bootstrapNotifyBarService.notifyDanger(res.Mensaje);
              });
            }

          });
        //}
      }

    } else {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe de agregar items para el envio.');
      //toast.info('Info Edi!', 'Debe de agregar items para el envio.');
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

  }
  btnVerDetalleOrdenes() {

  }
  btnExportarExcelOrdenes() {

    this.rptDistribucionExcelService.exportReport(this.ordenesMatTableDataSource.data,"ReporteOrdenesEntrega").then(() => {
      //location.reload()
    })

  }

  aprobar() {
    
    if (this.datosDistribucion.sol.centrocosto.Id==0) {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe de seleccionar un centro de costo.');
      return;
    }
    if (this.datosDistribucion.sol.proveedor.Id==0) {
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

          var req = {
            IdDistribuciones: this.ticket.Id,
            Aprobar: true,
            IdProveedor: this.datosDistribucion.sol.proveedor.Id,
            IdUnidadOrganizativa: this.datosDistribucion.sol.centrocosto.Id
          };

          
          return this.distribucionesService.aprobarRechazar(req).then((res) => {
            if (res.TipoResultado == 1)
              this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
            else this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
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

          const req = {
            IdDistribuciones: this.ticket.Id,
            Aprobar: false,
            MotivoRechazo : confirmado.txtComentarioRechazo
          };
          return this.distribucionesService.aprobarRechazar(req).then((res) => {
            if (res.TipoResultado == 1)
              this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
            else this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
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

          var req = {
            IdDistribuciones: this.ticketId
          };
          return this.distribucionesService.anularDistribucion(req).then((res) => {
            if (res.TipoResultado == 1) {
              this.bootstrapNotifyBarService.notifySuccess(res.Mensaje);
              this.distribucionesService.obtenerTicketId(this.ticketId).then((res) => {
                this.ticket = res.data;
                this.permisos = res.permisos;
              });
            } else this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
          });
        }

      });
    //}


  }


  // public exportReport(json: any[], excelFileName: string): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     const Excel = require('exceljs');
  //     const Workbook = new Excel.Workbook();
  //     const title = "Reporte de Convenio SCTR";
  //     //const subtitle1 = "Rango : " + FecIni + " - " + FecFin;
  //     let header = ["RECIBO",
  //                   "PRODUCTO",
  //                   "POLIZA",
  //                   "INICIOVIGENCIA",
  //                   "FINVIGENCIA",
  //                   "VENCIMIENTO",
  //                   "MONEDA.",
  //                   "MODALIDADPAGO",
  //                   "SCLIENT",
  //                   "NUMEROPAGO",
  //                   "MAIL",
  //                   "NOMBRE",
  //                   "DNI",
  //                   "SDIRECCION",
  //                   "FACTURA",
  //                   "IMPORTE",
  //                   "FECHA EMISIÓN" ];

  //     const workbook = Workbook;
  //     const worksheet = workbook.addWorksheet("Reporte_Convenio_SCTR");
  //     const titleRow = worksheet.addRow([title]);
  //    // worksheet.addRow([subtitle1]);
  //     titleRow.font = { name: 'Calibri', family: 4, size: 16, bold: true };
  //     worksheet.getCell('A1').alignment = { horizontal: 'center' };
  //     worksheet.getCell('A2').alignment = { horizontal: 'center' };

  //     const logo = Workbook.addImage({ base64:'data:image/jpeg;base64,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',
  //     extension: 'png'});

  //     worksheet.addImage(logo, 'A1:B3');
  //     worksheet.mergeCells('A1:R1'); 
  //     worksheet.mergeCells('A2:R2'); 

  //     // Fila en blanco
  //     worksheet.addRow([]);

  //     const headerRow = worksheet.addRow(header);
  //     headerRow.alignment = { horizontal: 'center' };
  //     headerRow.font = { name: 'Calibri', family: 4, size: 11, bold: true, color:  { argb: 'ffffff' }};
  //     headerRow.eachCell((cell, number1) => {      
  //           cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'a30000' }, bgColor: { argb: 'a30000' }};
  //           cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }};          
  //       });

  //     const Filas = json.length;

  //     for (let i = 0; i < Filas; i++) {   

  //       let vRows = json[i];

  //       const dato = [
  //                     json[i].RECIBO,
  //                     json[i].PRODUCTO,
  //                     json[i].POLIZA,
  //                     //(json[i].INICIOVIGENCIA == '' || json[i].INICIOVIGENCIA == null)?'':new Date(Date.parse(json[i].INICIOVIGENCIA)),
  //                     //(json[i].FINVIGENCIA == '' || json[i].FINVIGENCIA == null)?'':new Date(Date.parse(json[i].FINVIGENCIA)),
  //                     //(json[i].VENCIMIENTO == '' || json[i].VENCIMIENTO == null)?'':new Date(Date.parse(json[i].VENCIMIENTO)),
  //                     json[i].INICIOVIGENCIA,
  //                     json[i].FINVIGENCIA,
  //                     json[i].VENCIMIENTO,
  //                     json[i].MONEDA,
  //                     (json[i].MODALIDADPAGO),
  //                     (json[i].SCLIENT),
  //                     (json[i].NUMEROPAGO),
  //                     (json[i].MAIL),
  //                     json[i].NOMBRE,
  //                     json[i].DNI,
  //                     json[i].SDIRECCION,
  //                     json[i].FACTURA,
  //                     json[i].IMPORTE,
  //                     (json[i].EMISION == '' || json[i].EMISION == null)?'':new Date(Date.parse(json[i].EMISION))
  //       ];

  //       const row = worksheet.addRow(dato);

  //       row.eachCell((cell:any, number1:any) => {  
  // /*           if(number1 == 1 || number1 == 2)    
  //         {
  //           cell.alignment = { horizontal: 'center' };
  //         }  */     
  //         if(number1 == 4 || number1 == 5 || number1 == 6 || number1 == 17)    
  //         {
  //           cell.numberFormat = "dd/MM/yyyy";
  //         }
  //         if(number1 == 16)    
  //         {
  //           cell.numberFormat = "###,##0.00";
  //           //cell.alignment = { horizontal: 'right' };
  //         }
  //         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' }};      
  //       });  
  //     }

  //     worksheet.getColumn(1).width = 17;
  //     worksheet.getColumn(2).width = 23;
  //     worksheet.getColumn(3).width = 20;
  //     worksheet.getColumn(4).width = 14;
  //     worksheet.getColumn(5).width = 25;
  //     worksheet.getColumn(6).width = 25;
  //     worksheet.getColumn(7).width = 15;
  //     worksheet.getColumn(8).width = 45;
  //     worksheet.getColumn(9).width = 18;
  //     worksheet.getColumn(10).width = 18;
  //     worksheet.getColumn(11).width = 45;
  //     worksheet.getColumn(12).width = 45;
  //     worksheet.getColumn(13).width = 18;
  //     worksheet.getColumn(14).width = 80;
  //     worksheet.getColumn(15).width = 18;
  //     worksheet.getColumn(16).width = 18;
  //     worksheet.getColumn(17).width = 18;
  //     // Generando archivo excel
  //     workbook.xlsx.writeBuffer().then((data) => {
  //       const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       FileSaver.saveAs(blob, excelFileName + '.xlsx');
  //     }).then(() => {
  //       resolve(true);
  //     });
  //   });
  // }
  async ngOnInit() {



    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.datosBasicosItemFormGroup = this._formBuilder.group({
      descripcionCtrl: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      cantidadCtrl: ["", Validators.required],
      unidadMedidaCtrl: ["", Validators.required],
    });

    console.log(this.ticket);
    let valor: any = this.route.snapshot.paramMap.get('id');
    if (parseInt(valor) != 0) {
      var respuestaTicket = await this.distribucionesService.obtenerTicketId(parseInt(valor));
      if (respuestaTicket.TipoResultado == 1) {
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
      }

      var respuestaProveedor = await this.distribucionesService.obtenerProveedoresDistribucion(62);
      this.listProveedor = respuestaProveedor;

      var respuestaLog = await this.distribucionesService.obtenerLogAcciones({
        tabla: 1008,
        entidad: this.ticketId
      });
      this.listLogs = respuestaLog;
      console.log(this.listLogs);

      var respuestaCentroCosto = await this.distribucionesService.obtenerCentroCosto(62);
      this.listCentroCosto = respuestaCentroCosto;      

    }

    var respuestavalidarCalificacion = await this.distribucionesService.validarCalificacion();
    if (respuestavalidarCalificacion.TipoResultado === 1) {
      if (respuestavalidarCalificacion.Mensaje) this.bootstrapNotifyBarService.notifySuccess('Info Edi!' + respuestavalidarCalificacion.Mensaje);
    } else {
      // if (!$scope.ticket.Id) {
      //     $scope.bloquearTodo = false;
      //     $scope.mensajeBloqueo = res.Mensaje;
      //     toast.info('Info Edi!', res.Mensaje);
      // }
    }


    var respuestaTipoServicio = await this.listavaloresService.getListaValores({ idlista: 180, idcliente: "" });
    if (respuestaTipoServicio.TipoResultado == 1)
      this.listTipoServicio = respuestaTipoServicio.ListaEntidadComun;

    var respuestaTipoOrigen = await this.listavaloresService.getListaValores({ idlista: 181, idcliente: "" });
    if (respuestaTipoOrigen.TipoResultado == 1) {
      this.listOrigen = respuestaTipoOrigen.ListaEntidadComun;
      this.listDestino = respuestaTipoOrigen.ListaEntidadComun;
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
