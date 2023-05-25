import {Component, OnInit, OnDestroy} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MaterialesService} from '../../services/materiales.service';
import {
  DialogoConfirmacionComponent
} from '../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import {MatDialog} from "@angular/material/dialog";
import {ClientePorUsuario} from "../../../../core/models/ClienteDto";
import {TipoSolicitud} from "../../../../core/models/SolicitudDto";
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../../../core/auth/auth.service";
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {ChecklistDatabaseInmueble} from "../../services/ChecklistDatabaseInmueble.service";
import {
  ChecklistDatabaseGrupoMantenimiento
} from "@modules/solicitudes/services/ChecklistDatabaseGrupoMantenimiento.service";
import {InmuebleFlatNode, InmuebleNode} from "../../../../core/models/inmuebletree.model";
import {GrupoMantenimientoFlatNode, GrupoMantenimientoNode} from "../../../../core/models/grupomantenimientotree.model";
import {debounceTime, distinctUntilChanged, tap, switchMap, finalize, filter} from 'rxjs/operators';
import {NgProgress, NgProgressRef} from '@ngx-progressbar/core';
import {BootstrapNotifyBarService} from "@shared/services/bootstrap-notify.service";
import {ClienteService} from '@shared/services/cliente.service';


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
  selector: 'app-registro-almacenes',
  templateUrl: './registro-almacenes.component.html',
  styleUrls: ['./registro-almacenes.component.css'],
  providers: [ChecklistDatabaseInmueble, ChecklistDatabaseGrupoMantenimiento]
})
export class RegistroAlmacenesComponent implements OnInit, OnDestroy {
  progressRef!: NgProgressRef;
  value: number = 0;
  mode = new UntypedFormControl('side');
  isLoading = false;

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

  treeFlattenerGrupoMantenimiento = new MatTreeFlattener(this._transformerGrupoMantenimiento, node => node.level, node => node.expandable, node => node.children);

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

      Codigo: node.Codigo,
      textoMostrar: node.textoMostrar

    };
  }
  treeControlEquipo = new FlatTreeControl<EquipoFlatNode>(node => node.level, node => node.expandable);
  treeFlattenerEquipo = new MatTreeFlattener(this._transformerEquipo, node => node.level, node => node.expandable, node => node.children);
  dataSourceEquipo = new MatTreeFlatDataSource(this.treeControlEquipo, this.treeFlattenerEquipo);
  hasChildEquipo = (_: number, node: EquipoFlatNode) => node.expandable;
  isSubmitted: boolean = false;

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
  listSolicitanteSeteado: any = [];//
  IdsSolicitante: any = [];//


  _filtroLocalStoreage: any = {};//
  IdsClientes = [];
  listClienteSeteado: any = [];
  listResponsableSeteado = [];
  listResponsable = [];
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
  ///
  dataSource = [];
  displayedColumns: string[] =
    [
      'Eliminar',
      'NroTributario',
      'RazonSocial',
      'NombreCorto',
    ];
  dataSource1 = [];
  displayedColumns1: string[] =
    [
      'Eliminar',
      'Usuario',
      'Nombre',
    ];

//
  //listSolicitante: TipoSolicitud[] = [];
  isShowing: boolean = false;

  /* btnAdjunto() {
     if (this.flagContenedorEquipo == true && this.isShowing == true) {
       this.flagContenedorEquipo = false;
       this.flagContenedorAdjunto = true;
     } else {
       this.isShowing = !this.isShowing;
       this.flagContenedorEquipo = false;
       this.flagContenedorAdjunto = true;
     }
   }*/

  private _filterListarClientePorUsuario(name: string): ClientePorUsuario[] {
    const filterValue = name.toLowerCase();
    return this.optionsCliente.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  RegEx_mailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  //RegEx_Telefono = "^[679]{1}[0-9]{8}$";
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEquipoFormGroup!: UntypedFormGroup;

  constructor(
    public router: Router,
    private ngProgress: NgProgress,
    public clienteService: ClienteService,
    private databaseGrupoMantenimiento: ChecklistDatabaseGrupoMantenimiento,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    public dialogo: MatDialog,
    private solicitudesService: MaterialesService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    //private snackBService: SnackBarService,

  ) {

  }

  ngOnDestroy(): void {
    this.ngProgress.destroyAll();
  }

  async ngOnInit() {

    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.progressRef = this.ngProgress.ref();
    this.progressRef.state.subscribe((state: any) => {


      if (localStorage.getItem("_filtroLocalStoreageSolicitudes") !== null && localStorage.getItem("_filtroLocalStoreageSolicitudes") !== '{}') {
        this._filtroLocalStoreage = JSON.parse(localStorage.getItem("_filtroLocalStoreageSolicitudes")!);
        this._filtroLocalStoreage.ClienteDefault.forEach((element: any) => {
          this.listClienteSeteado.push({
            Id: element.Id,
            Nombre: element.Nombre,
            NombreCorto: element.NombreCorto,
            NumeroDocumento: ''
          });
        });

      } else {
        this.listClienteSeteado.push({
          Id: this.datosEdi.ClienteDefault.Id,
          Nombre: this.datosEdi.ClienteDefault.Nombre,
          NombreCorto: this.datosEdi.ClienteDefault.NombreCorto,
          NumeroDocumento: ''
        });
      }


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
      Nombre: ['', [Validators.required]],

      Departamento: ['', [Validators.required]],
      Provincia: ['', [Validators.required]],
      Distrito: ['', [Validators.required]],
      Direccion: ['', [Validators.required]],
      CodigoEstablecimiento: ['', [Validators.required]],

      aprobadoresSolicitudCtrl: [[]],

    });
    this.datosBasicosFormGroup.controls["Distrito"].disable();
    this.datosBasicosFormGroup.controls["Provincia"].disable();

    /*Obtenero Clientes*/
    await this.getClientesPorUsuario();
    /*Carga informacion base de solicitud*/


    /*
    this.datosBasicosFormGroup.patchValue({
      myControlCliente: datosCliente,
            correoCtrl: datagetInfoBaseSolicitud.Email.toLocaleLowerCase(),
         telefonoCtrl: datagetInfoBaseSolicitud.TeleonoUsuario,

  });  */


  }


  closeGrupoUnidad(): void {
    this.datosBasicosFormGroup.patchValue({});
  }


  recibiRespuestaCliente(event: any): void {

    this.IdsClientes = event.map((x: any) => {
      return x
    });

  }

  recibiRespuestaResponsable(event: any): any {
    this.listResponsable = event.map((x: any) => {
      return x
    });

  }

  removeCliente(id: number) {
    this.IdsClientes = this.IdsClientes.filter((x: any) => x.Id !== id);
    this.listResponsable = this.listResponsable.filter((x: any) => x.idCliente !== id);
  }

  removeResponsable(id: number) {

    this.listResponsable = this.listResponsable.filter((x: any) => x.id !== id);
  }

  recibirRespuestaUbigeo(event: any): void {

    this.IdsSolicitante = event.map((x: any) => {
      return x
    });

    this.datosBasicosFormGroup.patchValue({Provincia: this.IdsSolicitante[0].provincia})

    this.datosBasicosFormGroup.patchValue({Distrito: this.IdsSolicitante[0].distrito})

  }

  async getClientesPorUsuario() {
    var res = await this.solicitudesService.getClientesPorUsuario();
    this.optionsCliente = res;
    this.filteredOptionsCliente = this.myControlCliente.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.NombreCorto)),
      map(nombre => (nombre ? this._filterListarClientePorUsuario(nombre) : this.optionsCliente.slice())),
    );
  }


  obtenerTipoSolicitud(IdCliente: any) {
    this.solicitudesService.getTipoSolicitud({idcliente: IdCliente}).then((res) => {
      this.listTipoSolicitud = res;
    });
  }

  //https://github.com/tamani-coding/angular-azure-blob-storage-sas-example/blob/main/src/app/azure-blob-storage.service.ts
  LimpiarRegistroSolicitud() {
    this.files = [];
    this.ControlGrupoMantenimientoSeleccionado = null;
    this.ControlInmuebleSeleccionado = null;
    this.datosBasicosFormGroup.patchValue({
      //myControlCliente: null,
      //myControlSolicitante:null,


      tipoSolicitudCtrl: '',
    });

  }

  async FinalizarRegistroSolicitud() {

    if (this.datosBasicosFormGroup.value.Nombre===null || this.datosBasicosFormGroup.value.Nombre.trim().length===0  ){
      this.bootstrapNotifyBarService.notifyDanger('Es necesario el Nombre!');
      return;
    }

   /* if( this.IdsSolicitante[0]===undefined)  {
       this.bootstrapNotifyBarService.notifyDanger('Es necesario el Departamento!');
       return;
     }*/
    if (this.datosBasicosFormGroup.value.Direccion===null || this.datosBasicosFormGroup.value.Direccion.trim().length===0  ){

      this.bootstrapNotifyBarService.notifyDanger('Es necesario la Dirección!');
      return;
    }
    if (this.datosBasicosFormGroup.value.CodigoEstablecimiento===null || this.datosBasicosFormGroup.value.CodigoEstablecimiento.trim().length===0  ){

      this.bootstrapNotifyBarService.notifyDanger('Es necesario el Codigo de Establecimiento!');
      return;
    }
    if (!(this.IdsClientes.length>=1)){
      this.bootstrapNotifyBarService.notifyDanger('Por lo menos seleccione un cliente');
      return;
    }
    if (!(this.listResponsable.length>=1)){
      this.bootstrapNotifyBarService.notifyDanger('Por lo menos seleccione un Responsable');
      return;
    }


     /*
     if (this.datosBasicosFormGroup.value.Ubigeo === null) {
       this.bootstrapNotifyBarService.notifyDanger('Es necesario el Ubigeo!');
       return;
     }

     if (this.datosBasicosFormGroup.value.Departamento === null) {
       this.bootstrapNotifyBarService.notifyDanger('Es necesario el Departamento!');
       return;
     }
     if (this.datosBasicosFormGroup.value.ProvinciaProvincia === null) {
       this.bootstrapNotifyBarService.notifyDanger('Es necesario la Provincia!');
       return;
     }
     if (this.datosBasicosFormGroup.value.Distrito === null) {
       this.bootstrapNotifyBarService.notifyDanger('Es necesario el Distrito!');
       return;
     }
     if (this.datosBasicosFormGroup.value.Direccion === null) {
       this.bootstrapNotifyBarService.notifyDanger('Es necesario la Direccion!');
       return;
     }
     if (this.datosBasicosFormGroup.value.CodigoEstablecimiento === null) {
       this.bootstrapNotifyBarService.notifyDanger('Es necesario el CodigoEstablecimiento!');
       return;
     }*/

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
       //   this.isSubmitted = true;
          this.progressRef.start()
          var req_solicitud = {
            Nombre: this.datosBasicosFormGroup.value.Nombre,
            IdUbigeo: this.IdsSolicitante[0].id,
            Direccion: this.datosBasicosFormGroup.value.Direccion,
            CodigoEstablecimiento: this.datosBasicosFormGroup.value.CodigoEstablecimiento,
            ListClientes: this.IdsClientes.map((x: any) => x.Id),
            ListResponsables: this.listResponsable.map((x: any) => x.id),

            IdUsuarioRegistro: this.datosEdi.Id,
          }
          var response = await this.solicitudesService.postGuardarAlmacenes(req_solicitud);
          if (response.success) {
            this.progressRef.complete();
            this.router.navigate(['/materiales/bandejaAlmacenes']);
          } else {

            this.router.navigate(['/materiales/bandejaAlmacenes']);

          }

        }
      });
  }

  showDropDownInmueble = false;


  showDropDownGrupoMantenimiento = false;


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

  /* validar campos
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
    }*/


  //#endregion
}

