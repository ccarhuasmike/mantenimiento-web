import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AzureService } from "../../../../core/azure/azure.service";
import { map, startWith } from 'rxjs/operators';
import { asEnumerable } from 'linq-es2015';
import { SolicitudesService } from '../../services/solicitudes.service';
import {
  DialogoConfirmacionComponent
} from '../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from "@angular/material/dialog";
import { ClientePorUsuario } from "../../../../core/models/ClienteDto";
import { TipoSolicitud } from "../../../../core/models/SolicitudDto";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../../../core/auth/auth.service";
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ChecklistDatabaseInmueble } from "../../services/ChecklistDatabaseInmueble.service";
import {
  ChecklistDatabaseGrupoMantenimiento
} from "@modules/solicitudes/services/ChecklistDatabaseGrupoMantenimiento.service";
import { InmuebleFlatNode, InmuebleNode } from "../../../../core/models/inmuebletree.model";
import { GrupoMantenimientoFlatNode, GrupoMantenimientoNode } from "../../../../core/models/grupomantenimientotree.model";
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize, filter } from 'rxjs/operators';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import {
  DialogAprobadoresComponent
} from "@shared/components/modal-busqueda-aprobadores/modal-busqueda-aprobadores.component";
import { ClienteService } from '@shared/services/cliente.service';



export interface EquipoNode {
  /*Id: Number;
  title: string;   
  label: string;
  */
  label: string;
  title: string;
  CodigoInventario: string;
  IdUnidadMantenimiento: Number;
  Nombre: string;
  IdNivel: Number;
  NombreTipoEquipo: string;
  NombreImagen: string;
  NombreGrupoMantenimiento: string;
  NombreUnidadMantenimiento: string;
  NombreInmueble: string;
  NombreEdificio: string;
  NombreNivel: string;
  Id: Number;
  Codigo: string;
  textoMostrar: string;
  children?: EquipoFlatNode[];
}

export interface EquipoFlatNode {
  expandable: boolean;
  label: string;
  title: string;
  level: number;
  CodigoInventario: string;
  IdUnidadMantenimiento: Number;
  Nombre: string;
  IdNivel: Number;
  NombreTipoEquipo: string;
  NombreImagen: string;
  NombreGrupoMantenimiento: string;
  NombreUnidadMantenimiento: string;
  NombreInmueble: string;
  NombreEdificio: string;
  NombreNivel: string;
  Id: Number;
  Codigo: string;
  textoMostrar: string;
}

@Component({
  selector: 'app-history-page',
  templateUrl: './registrostusuario-page.component.html',
  styleUrls: ['./registrostusuario-page.component.css'],
  providers: [ChecklistDatabaseInmueble, ChecklistDatabaseGrupoMantenimiento]
})
export class RegistroSTusuarioPageComponent implements OnInit, OnDestroy {
  progressRef!: NgProgressRef;
  clienteMaster: number = 0;
  value: number = 0;
  mode = new UntypedFormControl('side');
  isLoading = false;
  isSubmitted: boolean = false;
  /*Variables del Control Inmueble*/
  private _transformerInmueble = (node: InmuebleNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      level: level,
      Id: node.Id,
      label: node.label,
      IdInmueble: node.IdInmueble,
      IdEdificio: node.IdEdificio,
      IdNivel: node.IdNivel,
      IdArea: node.IdArea,

    };
  }
  treeControlInmueble = new FlatTreeControl<InmuebleFlatNode>(node => node.level, node => node.expandable);
  treeFlattenerInmueble = new MatTreeFlattener(this._transformerInmueble, node => node.level, node => node.expandable, node => node.children);
  dataSourceInmueble = new MatTreeFlatDataSource(this.treeControlInmueble, this.treeFlattenerInmueble);
  hasChildInmueble = (_: number, node: InmuebleFlatNode) => node.expandable;


  /*Variables del Control Inmueble*/
  private _transformerGrupoMantenimiento = (node: GrupoMantenimientoNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      level: level,
      Id: node.Id,
      label: node.label,
      nivel: node.nivel,
      IdGrupoMantenimiento: node.IdGrupoMantenimiento,
      IdUnidadMantenimiento: node.IdUnidadMantenimiento,
      IdClasificacionProblema: node.IdClasificacionProblema
    };
  }
  treeControlGrupoMantenimiento = new FlatTreeControl<GrupoMantenimientoFlatNode>(node => node.level, node => node.expandable);
  treeFlattenerGrupoMantenimiento = new MatTreeFlattener(this._transformerGrupoMantenimiento, node => node.level, node => node.expandable, node => node.children);
  dataSourceGrupoMantenimiento = new MatTreeFlatDataSource(this.treeControlGrupoMantenimiento, this.treeFlattenerGrupoMantenimiento);
  hasChildGrupoMantenimiento = (_: number, node: GrupoMantenimientoFlatNode) => node.expandable;

  /*Variables del Control Equipo*/
  private _transformerEquipo = (node: EquipoNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      level: level,
      Id: node.Id,
      label: node.label,

      title: node.title,
      CodigoInventario: node.CodigoInventario,
      IdUnidadMantenimiento: node.IdUnidadMantenimiento,
      Nombre: node.Nombre,
      IdNivel: node.IdNivel,
      NombreTipoEquipo: node.NombreTipoEquipo,
      NombreImagen: node.NombreImagen,
      NombreGrupoMantenimiento: node.NombreGrupoMantenimiento,
      NombreUnidadMantenimiento: node.NombreUnidadMantenimiento,
      NombreInmueble: node.NombreInmueble,
      NombreEdificio: node.NombreEdificio,
      NombreNivel: node.NombreNivel,
      // Id: node.nivel,
      Codigo: node.Codigo,
      textoMostrar: node.textoMostrar
      /*nivel: node.nivel,
      IdGrupoMantenimiento: node.IdGrupoMantenimiento,
      IdUnidadMantenimiento: node.IdUnidadMantenimiento,
      IdClasificacionProblema: node.IdClasificacionProblema*/
    };
  }
  treeControlEquipo = new FlatTreeControl<EquipoFlatNode>(node => node.level, node => node.expandable);
  treeFlattenerEquipo = new MatTreeFlattener(this._transformerEquipo, node => node.level, node => node.expandable, node => node.children);
  dataSourceEquipo = new MatTreeFlatDataSource(this.treeControlEquipo, this.treeFlattenerEquipo);
  hasChildEquipo = (_: number, node: EquipoFlatNode) => node.expandable;


  //checklistSelection = new SelectionModel<FoodFlatNode>(true /* multiple */);
  isHovering: boolean = false;
  files: any[] = [];
  allFiles: File[] = [];
  datosEdi: any = {};

  listResults$: Observable<any> = of([])
  stateCtrl = new UntypedFormControl('');
  /*Control Cliente*/
  myControlClientePrueba = new UntypedFormControl('');
  myControlCliente = new UntypedFormControl('');
  myControlSolicitante = new UntypedFormControl('');
  myControlInmueble = new UntypedFormControl('');
  myControlGrupoMantenimiento = new UntypedFormControl('');
  myControlEquipo = new UntypedFormControl('');
  ControlGrupoMantenimientoSeleccionado: any;
  NombreGrupoMantenimientoSeleccionado: any;
  ControlInmuebleSeleccionado: any;
  NombreInmuebleSeleccionado: any;
  optionsCliente: ClientePorUsuario[] = [];
  filteredOptionsCliente: Observable<ClientePorUsuario[]> = of([]);
  filteredMovies: any;
  optionsSolicitante: ClientePorUsuario[] = [];
  filteredOptionsSolicitante: any;//Observable<ClientePorUsuario[]> = of([]);

  flagContenedorAdjunto: boolean = false;
  flagContenedorEquipo: boolean = false;

  /*Control Tipo Solicitud*/
  listTipoSolicitud: TipoSolicitud[] = [];

  //listSolicitante: TipoSolicitud[] = [];
  isShowing: boolean = false;
  btnAdjunto() {
    if (this.flagContenedorEquipo == true && this.isShowing == true) {
      this.flagContenedorEquipo = false;
      this.flagContenedorAdjunto = true;
    } else {
      this.isShowing = !this.isShowing;
      this.flagContenedorEquipo = false;
      this.flagContenedorAdjunto = true;
    }
  }

  private _filterListarClientePorUsuario(name: string): ClientePorUsuario[] {
    
    //var s=this.datosBasicosFormGroup.value.myControlCliente;
    const filterValue = name.toLowerCase();
    return this.optionsCliente.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  private _filterListarSolicitante(name: string): ClientePorUsuario[] {
    const filterValue = name.toLowerCase();
    return this.optionsSolicitante.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }

  displayFnClientePorUsuario(user: ClientePorUsuario): string {
    
    return user && user.nombre ? user.nombre : '';
  }

  displayFnClientePorUsuarioPrueba(user: any): string {

    return user && user.name ? user.name : '';
  }

  displayFnSolicitante(user: any): string {
    return user ? user.nombre : '';
  }


  RegEx_mailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  //RegEx_Telefono = "^[679]{1}[0-9]{8}$";
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEquipoFormGroup!: UntypedFormGroup;
  constructor(
    public clienteService: ClienteService,
    public router: Router,
    private ngProgress: NgProgress,
    private databaseInmueble: ChecklistDatabaseInmueble,
    private databaseGrupoMantenimiento: ChecklistDatabaseGrupoMantenimiento,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    public dialogo: MatDialog,
    private solicitudesService: SolicitudesService,
    //private snackBService: SnackBarService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private azureService: AzureService,
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
    this.myControlClientePrueba.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          // this.errorMsg = "";
          this.filteredMovies = [];
          this.isLoading = true;
        }),
        filter((name) => !!name),
        switchMap(value => this.solicitudesService.ListarClientePorUsuario(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe(data => {
        this.filteredMovies = data;
      });
    //Inicializacion de form group
    this.datosEquipoFormGroup = this._formBuilder.group({
      myControlEquipo: this.myControlEquipo,
    });

    this.datosBasicosFormGroup = this._formBuilder.group({
      myControlCliente: this.myControlCliente,
      myControlSolicitante: this.myControlSolicitante,
      myControlInmueble: this.myControlInmueble,
      myControlGrupoMantenimiento: this.myControlGrupoMantenimiento,

      correoCtrl: ['', [Validators.required, Validators.pattern(this.RegEx_mailPattern), Validators.minLength(8), Validators.maxLength(50)]],
      telefonoCtrl: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(20)]],
      tipoSolicitudCtrl: ["0", Validators.required],
      aprobadoresSolicitudCtrl: [[]],
      descripcionDetalladaCtrl: ['', Validators.required]
    });
    /*Obtenero Clientes*/
    await this.getClientesPorUsuario();
    /*Carga informacion base de solicitud*/
   
    var datagetInfoBaseSolicitud = await this.solicitudesService.getInfoBaseSolicitud();
    if(this.clienteMaster==0){
      var datosCliente = this.optionsCliente.find(x => x.id === datagetInfoBaseSolicitud.IdCliente);
    }else{
      var datosCliente = this.optionsCliente.find(x => x.id === this.clienteMaster);
    }
    

    this.datosBasicosFormGroup.patchValue({
      myControlCliente: datosCliente,
      myControlSolicitante: {
        nombre: this.datosEdi.ApellidoPaterno + " " + this.datosEdi.ApellidoMaterno + " " + this.datosEdi.Nombre,
        id: this.datosEdi.Id
      },
      myControlInmueble: "",
      myControlGrupoMantenimiento: "",
      correoCtrl: datagetInfoBaseSolicitud.Email.toLocaleLowerCase(),
      telefonoCtrl: datagetInfoBaseSolicitud.TelefonoUsuario,
      tipoSolicitudCtrl: "",
      descripcionDetalladaCtrl: ""
    });

    this.myControlSolicitante.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      //filter((name) => name.length > 2),
      tap(() => {
        // this.errorMsg = "";
        this.filteredOptionsSolicitante = [];
        this.isLoading = true;
      }),
      switchMap(value => this.solicitudesService.getSolicitante({
        idcliente: this.datosBasicosFormGroup.value.myControlCliente.id,
        nombre: value,
      }).finally(() => {
        this.isLoading = false
      })
      )
    ).subscribe(data => {
      this.filteredOptionsSolicitante = data;
    });
    this.myControlInmueble.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        //filter((name) => name.length > 2),
        tap(() => {
          this.filteredOptionsSolicitante = [];
          this.isLoading = true;
        }),
        switchMap(value => this.solicitudesService.getArbolInmuebles({
          IdCliente: this.datosBasicosFormGroup.value.myControlCliente.id,
          IdUsuario: this.datosEdi.Id,
          nombre: value,
        }).finally(() => {
          this.isLoading = false
        })
        )
      )
      .subscribe(responseInmuble => {

        if (responseInmuble.TipoResultado) {
          this.dataSourceInmueble.data = responseInmuble.Lista;
          if (this.dataSourceInmueble.data.length > 0) {
            this.showDropDownInmueble = true;
            //this.treeControlInmueble.expandAll();
          } else {
            this.showDropDownInmueble = false;
            //this.treeControlInmueble.collapseAll();
          }
          this.treeControlInmueble.collapseAll();
        }
      });
    this.myControlGrupoMantenimiento.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        //filter((name) => name.length > 2),
        tap(() => {

          this.filteredOptionsSolicitante = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          if (this.datosBasicosFormGroup.value.tipoSolicitudCtrl !== "") {
            return this.solicitudesService.getArbolGrupoUnidad(
              {
                IdCliente: this.datosBasicosFormGroup.value.myControlCliente.id,
                IdTipoSolicitud: this.datosBasicosFormGroup.value.tipoSolicitudCtrl.id,
                Nombre: value,
                Origen: 1,
                UsuarioLogin: this.datosEdi.Id
              }
            ).finally(() => {
              this.isLoading = false;
            });
          } else {
            this.isLoading = false;
            return of({});
          }
        }
        )
      )
      .subscribe(responseGrupoMantenimiento => {
        if (responseGrupoMantenimiento.TipoResultado) {
          this.dataSourceGrupoMantenimiento.data = responseGrupoMantenimiento.Lista;
          if (this.dataSourceGrupoMantenimiento.data.length > 0) {
            this.showDropDownGrupoMantenimiento = true;
            //this.treeControlGrupoMantenimiento.expandAll();
          } else {
            this.showDropDownGrupoMantenimiento = false;
          }
          this.treeControlGrupoMantenimiento.collapseAll();
        }
      });


    this.myControlEquipo.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        filter((name) => name.length > 2),
        tap(() => {

          this.filteredOptionsSolicitante = [];
          this.isLoading = true;
        }),
        switchMap(value => {
          if (this.IdTipoEquipoSeleccionado !== 0) {
            return this.solicitudesService.postBuscarEquipoParaElRegistro(
              {
                IdTipoEquipo: this.IdTipoEquipoSeleccionado,
                IdCliente: this.datosBasicosFormGroup.value.myControlCliente.id,
                IdInmueble: this.ControlInmuebleSeleccionado.IdInmueble,
                IdEdificio: this.ControlInmuebleSeleccionado.IdEdificio,
                filtroNombre: value
              }
            ).finally(() => {
              this.isLoading = false;
            });
          } else {
            this.isLoading = false;
            return of({});
          }
        }
        )
      )
      .subscribe(responseEquipo => {
        this.isLoading = false;
        this.dataSourceEquipo.data = responseEquipo;
        if (this.dataSourceEquipo.data.length > 0) {
          this.showDropDownEquipo = true;
          //this.treeControlGrupoMantenimiento.expandAll();
        } else {
          this.showDropDownEquipo = false;
        }
        this.treeControlEquipo.collapseAll();
      });

    await this.obtenerTipoSolicitud(datagetInfoBaseSolicitud.IdCliente);
  }

  closeInmueble(): void {
    this.datosBasicosFormGroup.patchValue({
      myControlInmueble: null
    });
  }
  searchInmueble(): void {
    this.isLoading = true;
    this.solicitudesService.getArbolInmuebles({
      IdCliente: this.datosBasicosFormGroup.value.myControlCliente.id,
      IdUsuario: this.datosEdi.Id,
      nombre: ""
    }).then((responseInmuble) => {

      if (responseInmuble.TipoResultado) {
        this.dataSourceInmueble.data = responseInmuble.Lista;
        this.isLoading = false
        if (this.dataSourceInmueble.data.length > 0) {
          this.showDropDownInmueble = true;
          //this.treeControlInmueble.expandAll();
        } else {
          this.showDropDownInmueble = false;
          //this.treeControlInmueble.collapseAll();
        }
        this.treeControlInmueble.collapseAll();
      }
    });
  }

  closeGrupoUnidad(): void {
    this.datosBasicosFormGroup.patchValue({
      myControlGrupoMantenimiento: null,
    });
  }
  searchGrupoUnidad(): void {
    this.isLoading = true;

    this.solicitudesService.getArbolGrupoUnidad(
      {
        IdCliente: this.datosBasicosFormGroup.value.myControlCliente.id,
        IdTipoSolicitud: this.datosBasicosFormGroup.value.tipoSolicitudCtrl.id,
        Nombre: "",
        Origen: 1,
        UsuarioLogin: this.datosEdi.Id
      }
    ).then((responseGrupoMantenimiento) => {
      this.isLoading = false;
      if (responseGrupoMantenimiento.TipoResultado) {
        this.dataSourceGrupoMantenimiento.data = responseGrupoMantenimiento.Lista;
        if (this.dataSourceGrupoMantenimiento.data.length > 0) {
          this.showDropDownGrupoMantenimiento = true;
          //this.treeControlGrupoMantenimiento.expandAll();
        } else {
          this.showDropDownGrupoMantenimiento = false;
        }
        this.treeControlGrupoMantenimiento.collapseAll();
      }
    });
  }


  async getClientesPorUsuario() {
    var res = await this.solicitudesService.getClientesPorUsuario();
    console.log(res);
    this.optionsCliente = res;
    
    this.filteredOptionsCliente = this.myControlCliente.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.NombreCorto)),
      map(nombre => (nombre ? this._filterListarClientePorUsuario(nombre) : this.optionsCliente.slice())),
    );
  }

  matAutocompleteSeleccionSolicitante(event: any) {

    this.datosBasicosFormGroup.patchValue({
      correoCtrl: event.email === undefined ? "" : event.email.toLowerCase(),
      telefonoCtrl: event.telefono === '0' ? '' : event.telefono
    });
  }

  async matAutocompleteSeleccionCliente(event: any) {

    this.listTipoSolicitud = [];
    this.dataSourceGrupoMantenimiento.data = [];
    this.dataSourceInmueble.data = [];
    this.datosBasicosFormGroup.patchValue({
      myControlGrupoMantenimiento: null,
      myControlInmueble: null,
      tipoSolicitudCtrl: '',
    });
    await this.obtenerTipoSolicitud(event.id);
  }

  obtenerTipoSolicitud(IdCliente: any) {
    this.solicitudesService.getTipoSolicitud({ idcliente: IdCliente }).then((res) => {
      this.listTipoSolicitud = res;
    });
  }

  async selectTipoSolicitudCtrl(data: any) {
    if (data !== null) {
      if (data.mensaje)
        this.bootstrapNotifyBarService.notifyWarning(data.mensaje);
    }
    this.datosBasicosFormGroup.patchValue({
      myControlGrupoMantenimiento: null
    });
    this.dataSourceGrupoMantenimiento.data = [];
  }

  //https://github.com/tamani-coding/angular-azure-blob-storage-sas-example/blob/main/src/app/azure-blob-storage.service.ts
  LimpiarRegistroSolicitud() {
    this.files = [];
    this.ControlGrupoMantenimientoSeleccionado = null;
    this.ControlInmuebleSeleccionado = null;
    this.datosBasicosFormGroup.patchValue({
      //myControlCliente: null,
      //myControlSolicitante:null,
      myControlGrupoMantenimiento: null,
      myControlInmueble: null,
      descripcionDetalladaCtrl: '',
      tipoSolicitudCtrl: '',
    });

  }

  async FinalizarRegistroSolicitud() {
    if (!this.datosBasicosFormGroup.valid)
      return;


    if (this.ControlInmuebleSeleccionado.IdEdificio === null) {
      this.bootstrapNotifyBarService.notifyDanger('Es necesario seleccionar un edificio!');
      return;
    }
    if (this.ControlInmuebleSeleccionado.IdNivel === null) {
      this.bootstrapNotifyBarService.notifyDanger('Es necesario seleccionar un nivel!');
      return;
    }
    if (this.datosBasicosFormGroup.value.tipoSolicitudCtrl === null) {
      this.bootstrapNotifyBarService.notifyDanger('Es necesario el tipo de solicitud!');
      return;
    }
    if (this.ControlGrupoMantenimientoSeleccionado.IdGrupoMantenimiento === null) {
      this.bootstrapNotifyBarService.notifyDanger('Es necesario el grupo y unidad!');
      return;
    }
    if (this.ControlGrupoMantenimientoSeleccionado.IdUnidadMantenimiento === null) {
      this.bootstrapNotifyBarService.notifyDanger('Es necesario la unidad!');
      return;
    }
    if (this.datosBasicosFormGroup.value.tipoSolicitudCtrl.esflujorequerimiento) {
      if (this.datosBasicosFormGroup.value.aprobadoresSolicitudCtrl === undefined) {
        this.bootstrapNotifyBarService.notifyDanger('Es necesario tener al menos un aprobador!');
        return;
      }
    }

    this.dialogo.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Mensaje de Confirmación`,
        mensaje: `Se grabara la solicitud. Desea continuar?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          this.isSubmitted = true;
          this.progressRef.start();
          var listArchivoBlobStorage: any = [];

          if (this.files.length > 0) {
            for await (const file of this.files) {
              const blob = new Blob([file], { type: file.type });
              const response = await this.azureService.uploadFile(blob, file.name);
              listArchivoBlobStorage.push({
                NombreInterno: response.uuidFileName,
                Nombre: file.name,
                NombreExtension: "." + file.name.split(".").pop(),
                Tamanio: file?.size,
              });
            }
          }


          var IdsEquipo = this.listEquipo.length == 0 ? [] : this.listEquipo.map((x: any) => { return x.Id });
          var req_solicitud = {
            IdCliente: this.datosBasicosFormGroup.value.myControlCliente.id,
            IdSolicitante: this.datosBasicosFormGroup.value.myControlSolicitante.id,
            TelefonoContacto: this.datosBasicosFormGroup.value.telefonoCtrl,
            NombreContactoAdicional: "",
            TelefonoContactoAdicional: "",
            IdTipoSolicitud: this.datosBasicosFormGroup.value.tipoSolicitudCtrl.id,
            CentroCosto: "",
            IdInmueble: this.ControlInmuebleSeleccionado.IdInmueble,
            IdEdificio: this.ControlInmuebleSeleccionado.IdEdificio,
            IdNivel: this.ControlInmuebleSeleccionado.IdNivel,
            IdClasificacionProblema: this.ControlGrupoMantenimientoSeleccionado.IdClasificacionProblema,
            IdTipoRiesgo: 0,
            NombreAmbiente: "",
            IdGrupoMantenimiento: this.ControlGrupoMantenimientoSeleccionado.IdGrupoMantenimiento,
            IdUnidadMantenimiento: this.ControlGrupoMantenimientoSeleccionado.IdUnidadMantenimiento,
            DescripcionCorta: this.datosBasicosFormGroup.value.descripcionDetalladaCtrl,
            DescripcionDetallada: this.datosBasicosFormGroup.value.descripcionDetalladaCtrl,
            ListIdsEquipos: IdsEquipo,
            ListIdAprobadorRequerimiento: this.datosBasicosFormGroup.value.aprobadoresSolicitudCtrl,
            Origen: 1,
            UsuarioLogin: this.datosEdi.Id,
            listAdjuntoCloud: listArchivoBlobStorage
          }
          var response = await this.solicitudesService.postGuardarSolicitud(req_solicitud);
          if (response) {
            debugger;
            let msg = '';
            if (response.Codigo) {
              msg = response.Mensaje + '\n Tu ticket generado es el ' + response.Codigo;
              this.bootstrapNotifyBarService.notifySuccess(msg);
              setTimeout(() => {
                this.router.navigate(['/solicitud/bandejasolicitud'])
              }, 3000)
              //this.datosBasicosFormGroup.reset();
              //this.LimpiarRegistroSolicitud();
            } else {
              this.isSubmitted = false;
              msg = response.Mensaje;
              this.bootstrapNotifyBarService.notifyWarning(msg);
            }
          }
          this.progressRef.complete();
        }
      });
  }

  showDropDownInmueble = false;

  selectedmattreenodeInmueble(data: any) {

    this.ControlInmuebleSeleccionado = data;
    this.datosBasicosFormGroup.patchValue({
      myControlInmueble: this.NombreInmuebleSeleccionado,
    });
    this.showDropDownInmueble = false;
  }

  getAncestorsInmueble(array: any, name: any) {

    if (array !== null) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].label === name) {
          return [array[i]];
        }
        const a: any = this.getAncestorsInmueble(array[i].children, name);
        if (a !== null) {
          a.unshift(array[i]);
          return a;
        }
      }
    }
    return null;
  }

  onLeafInmuebleNodeClick(node: any): void {
    const ancestors = this.getAncestorsInmueble(this.dataSourceInmueble.data, node.label);
    var listInmuebleSeleccionado: any = [];
    ancestors.forEach((ancestor: any) => {
      listInmuebleSeleccionado.push(`${ancestor.label}`);
      //breadcrumbs += `${ancestor.label}/`;
    });
    this.NombreInmuebleSeleccionado = listInmuebleSeleccionado.join(" / ");
    this.ControlInmuebleSeleccionado = node;
    this.datosBasicosFormGroup.patchValue({
      myControlInmueble: this.NombreInmuebleSeleccionado,
    });
    this.showDropDownInmueble = false;
  }


  showDropDownGrupoMantenimiento = false;

  selectedmattreenodeGrupoMantenimiento(data: any) {
    this.ControlGrupoMantenimientoSeleccionado = data;
    this.datosBasicosFormGroup.patchValue({
      myControlGrupoMantenimiento: this.NombreGrupoMantenimientoSeleccionado,
    });
    this.showDropDownGrupoMantenimiento = false;
  }

  getAncestorsGrupoUnidad(array: any, name: any) {
    if (array !== null) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].label === name) {
          return [array[i]];
        }
        const a: any = this.getAncestorsGrupoUnidad(array[i].children, name);
        if (a !== null) {
          a.unshift(array[i]);
          return a;
        }
      }
    }
    return null;
  }

  async onLeafGrupoUnidadNodeClick(node: any) {
    const ancestors = this.getAncestorsGrupoUnidad(this.dataSourceGrupoMantenimiento.data, node.label);
    let breadcrumbs = "";
    var listGrupoUnidadSeleccionado: any = [];
    ancestors.forEach((ancestor: any) => {
      listGrupoUnidadSeleccionado.push(`${ancestor.label}`);
      //breadcrumbs += `${ancestor.label}/`;
    });

    this.NombreGrupoMantenimientoSeleccionado = listGrupoUnidadSeleccionado.join(" / ");
    this.ControlGrupoMantenimientoSeleccionado = node;
    this.datosBasicosFormGroup.patchValue({
      myControlGrupoMantenimiento: this.NombreGrupoMantenimientoSeleccionado,
    });
    this.showDropDownGrupoMantenimiento = false;

    if (this.datosBasicosFormGroup.value.tipoSolicitudCtrl.esflujorequerimiento) {
      var dataObtenerAprobadores = await this.solicitudesService.postObtenerAprobadores({
        IdCliente: this.datosBasicosFormGroup.value.myControlCliente.id,
        IdTipoSolicitud: this.datosBasicosFormGroup.value.tipoSolicitudCtrl.id,
        IdInmueble: this.ControlInmuebleSeleccionado.IdInmueble,
        IdEdificio: this.ControlInmuebleSeleccionado.IdEdificio,
        IdNivel: this.ControlInmuebleSeleccionado.IdNivel,
        IdGrupoMantenimiento: node.IdGrupoMantenimiento,
        IdUnidadMantenimiento: node.IdUnidadMantenimiento
      }
      );
      if (dataObtenerAprobadores.EsNecesarioParaElRegistro) {
        if (dataObtenerAprobadores.ListAprobadores.length === 0) {
          this.bootstrapNotifyBarService.notifyDanger('No existe Aprobador de requerimientos!');
          return;
        } else {
          if (dataObtenerAprobadores.MostrarSeleccionDeAprobadores) {
            this.dialogo.open(DialogAprobadoresComponent, {
              maxWidth: '50vw',
              maxHeight: 'auto',
              height: 'auto',
              width: '50%',
              disableClose: true,
              data: {
                listAprobadores: dataObtenerAprobadores.ListAprobadores
                /*clientChekeado : this.clientSeleccionado.map(x=>{ return x.Id}),
                IdsCliente:this.value==""? []:this.value*/
              }
              //data: this.clientSeleccionado.map(x=>{ return x.Id})
            })
              .afterClosed()
              .subscribe(async (confirmado: any) => {

                if (confirmado.respuesta) {
                  this.datosBasicosFormGroup.patchValue({
                    aprobadoresSolicitudCtrl: confirmado.aprobadoresSeleccionado.length === 0 ? [] : confirmado.aprobadoresSeleccionado.map((x: any) => { return x.Id })
                  });
                }
              });
            //MOSTRAR POPUP CON APROBADORES PARA SELECCION

          } else {

            this.datosBasicosFormGroup.patchValue({
              aprobadoresSolicitudCtrl: dataObtenerAprobadores.ListAprobadores.length === 0 ? [] : dataObtenerAprobadores.ListAprobadores.map((x: any) => { return x.Id })
            });
          }
        }
      }
    }

  }
  listEquipo: any = [];
  listEquipoAgrupado: any = [];
  showDropDownEquipo = false;
  EquipoSeleccionado: any
  IdTipoEquipoSeleccionado: number = 0;
  async selectTipoEquipoCtrl(data: any) {
    if (data === null)
      this.IdTipoEquipoSeleccionado = 0;
    else
      this.IdTipoEquipoSeleccionado = data.Id;
    this.datosEquipoFormGroup.patchValue({
      myControlEquipo: "",
    });
    this.dataSourceEquipo.data = [];
  }
  btnEquipo() {

    if (this.datosBasicosFormGroup.value.myControlCliente === "") {
      this.bootstrapNotifyBarService.notifyDanger('Es necesario seleccionar un cliente!');
      return;
    }
    if (this.ControlInmuebleSeleccionado === undefined) {
      this.bootstrapNotifyBarService.notifyDanger('Es necesario seleccionar un inmueble!');
      return;
    }
    if (this.ControlInmuebleSeleccionado.IdEdificio === null) {
      this.bootstrapNotifyBarService.notifyDanger('Es necesario seleccionar un edificio!');
      return;
    }


    if (this.flagContenedorAdjunto == true && this.isShowing == true) {
      this.flagContenedorAdjunto = false;
      this.flagContenedorEquipo = true;
    } else {
      this.isShowing = !this.isShowing;
      this.flagContenedorAdjunto = false;
      this.flagContenedorEquipo = true;
    }
    this.ListarTipoEquipo();
  }
  closeEquipo(): void {
    this.datosEquipoFormGroup.patchValue({
      myControlEquipo: null,
    });
  }
  searchEquipo(): void {
    if (this.IdTipoEquipoSeleccionado === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione Tipo de Equipo ");
      return;
    }
    this.isLoading = true;
    this.solicitudesService.postBuscarEquipoParaElRegistro(
      {
        IdTipoEquipo: this.IdTipoEquipoSeleccionado,
        IdCliente: this.datosBasicosFormGroup.value.myControlCliente.id,
        IdInmueble: this.ControlInmuebleSeleccionado.IdInmueble,
        IdEdificio: this.ControlInmuebleSeleccionado.IdEdificio,
        filtroNombre: ""
      }
    ).then((responseEquipo) => {
      this.isLoading = false;
      this.dataSourceEquipo.data = responseEquipo;
      if (this.dataSourceEquipo.data.length > 0) {
        this.showDropDownEquipo = true;
        //this.treeControlGrupoMantenimiento.expandAll();
      } else {
        this.showDropDownEquipo = false;
      }
      this.treeControlEquipo.collapseAll();

    });
  }
  async onLeafEquipo(node: any) {
    this.EquipoSeleccionado = node;
    this.datosEquipoFormGroup.patchValue({
      myControlEquipo: node.textoMostrar,
    });
    this.showDropDownEquipo = false;
  }
  AgregarEquipo() {
    /*Limpiamos el control de equipos */
    this.datosEquipoFormGroup.patchValue({
      myControlEquipo: "",
    });
    if (this.listEquipo.length > 0) {
      var existeEquipoAgregado = this.listEquipo.some((x: any) => { return x.Id === this.EquipoSeleccionado.Id });
      if (existeEquipoAgregado) {
        this.bootstrapNotifyBarService.notifyWarning("Equipo está agregado");
      } else
        this.listEquipo.push(this.EquipoSeleccionado);
    } else
      this.listEquipo.push(this.EquipoSeleccionado);
    this.listarEquiposAgrupado();
  }
  listarEquiposAgrupado() {
    this.listEquipoAgrupado = [];
    this.listEquipoAgrupado = asEnumerable(this.listEquipo)
      .Select((option, index: any) => { return { option, index }; })
      .GroupBy(
        x => Math.floor(x.index / 2),
        x => x.option,
        (key, options) => asEnumerable(options).ToArray()
      )
      .ToArray();
  }
  //#endregion


  filterChangedGrupoMantenimiento(filterText: any) {
    this.databaseGrupoMantenimiento.filter(filterText.target.value);
    if (filterText) {
      this.showDropDownGrupoMantenimiento = true;
      this.treeControlGrupoMantenimiento.expandAll();
    } else {
      this.showDropDownGrupoMantenimiento = false;
      this.treeControlGrupoMantenimiento.collapseAll();
    }
  }

  //#endregion

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

  //#endregion
  //#region ngx-dropzone

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

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }
  isFileSizeAllowed(size: any) {
    let isFileSizeAllowed = false;
    if (size < 2000000) {
      isFileSizeAllowed = true;
    }
    return isFileSizeAllowed;
  }

  listTipoEquipo: any = [];
  ListarTipoEquipo() {
    this.solicitudesService.getListarTipoEquipo().then((respuesta) => {

      this.listTipoEquipo = respuesta;
    });
  }

  //#endregion
}
