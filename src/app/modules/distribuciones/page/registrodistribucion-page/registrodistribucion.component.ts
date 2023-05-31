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

import { MatTableDataSource, MatTable } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';

export interface Items {
  Id: number,
  Destino: string,
  Descripcion: string,
  Cantidad: number,
  IdUnidadMedida: number,
  UnidadMedida: string,
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
  datosDistribucion = {
    sol: {
      usuario_destino: {
        Id: 0
      },
      direccion_origen: "",
      direccion_destino: "",
      descripcion: "",
      disponibilidad: "",
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
  listAgenciaOrigen: any[] = [];
  listAgenciaDestino: any[] = [];
  listTipoServicio: any[] = [];
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
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  constructor(
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


  btnCargaMasivaDistribucion() {
    this.dialogo.open(DialogoCargaMasivaDistribucionComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        titulo: `Carga Masiva Distribución`,
        //listAprobadores: dataObtenerAprobadores.ListAprobadores
        /*clientChekeado : this.clientSeleccionado.map(x=>{ return x.Id}),
        IdsCliente:this.value==""? []:this.value*/
      }
      //data: this.clientSeleccionado.map(x=>{ return x.Id})
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
        //listAprobadores: dataObtenerAprobadores.ListAprobadores
        /*clientChekeado : this.clientSeleccionado.map(x=>{ return x.Id}),
        IdsCliente:this.value==""? []:this.value*/
      }
      //data: this.clientSeleccionado.map(x=>{ return x.Id})
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

  ngOnDestroy(): void {
    this.ngProgress.destroyAll();
  }
  btnEliminarItem(item: any) {
    var ObjectIndex = this.dataSourceItems.findIndex(function (obj) { return obj.Id == item.Id; });//Obtenemos el Index del List de Objetos        
    if (ObjectIndex != -1) {
      this.dataSourceItems.splice(ObjectIndex, 1);
    }
    this.table.renderRows();
  }
  btnAgregarItem() {
    if (!this.datosBasicosItemFormGroup.valid)
      return;
    this.dataSourceItems.push({
      Id: new Date().getTime(),
      Destino: "",
      Descripcion: this.datosBasicosItemFormGroup.value.descripcionCtrl,
      Cantidad: this.datosBasicosItemFormGroup.value.cantidadCtrl,
      IdUnidadMedida: this.datosBasicosItemFormGroup.value.unidadMedidaCtrl.Id,
      UnidadMedida: this.datosBasicosItemFormGroup.value.unidadMedidaCtrl.Nombre,
    });
    this.table.renderRows();
    // this.datosBasicosItemFormGroup.patchValue({
    //   descripcionCtrl: "",
    //   cantidadCtrl: "",
    //   unidadMedidaCtrl: "",
    // })
  }

  btnGrabar() {
    debugger;
    let _otros = false;
    let _multiples_origenes = false;
    let _multiples_destinos = false;
    if (!this.datosDistribucion.sol.prioridad) {
      this.bootstrapNotifyBarService.notifyWarning('Info Edi! ' + 'Debe seleccionar una prioridad.');
      return;
    }
    if (!this.datosDistribucion.sol.tipopaquete) {
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
          Items: this.dataSourceItems,
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
          Items: this.dataSourceItems,
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
        //}
      }

    }
  }
  seleccionarTipoServicio(val: any) {
    debugger;
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
    debugger;
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

  seleccionarSedeDestino  (i:any) {
    debugger;
    this.distribucionesService.obtenerUsuariosPorInmueble(i).then((res) => {
        this.UsuarioDestino = res.ListaUsuarios;
    });
    var datoseleccionado = this.listAgenciaDestino.find(x => { return x.Id == i });
    this.datosDistribucion.sol.direccion_destino = datoseleccionado.Nombre2;
    //this.datosDistribucion.sol.direccion_destino = i.Nombre2;
}

  seleccionarSedeOrigen(i: number) {
    debugger;
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

  }
  async ngOnInit() {

    this.datosBasicosItemFormGroup = this._formBuilder.group({
      descripcionCtrl: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      cantidadCtrl: ["", Validators.required],
      unidadMedidaCtrl: ["", Validators.required],
    });

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

    debugger;
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
    // var respuestaCentroCosto = await this.distribucionesService.obtenerCentroCosto(62);
    // if (respuestaCentroCosto.TipoResultado == 1)
    //   this.listCentroCosto = respuestaCentroCosto.ListaEntidadComun;
    // debugger;
  }

  FinalizarRegistroSolicitud() {

  }


  //#endregion
}
