import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { eLista } from "@core/types/formatos.types";
import { ListavaloresService } from "@shared/services/listavalores.service";
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { SolicitudesService } from '@modules/solicitudes/services/solicitudes.service';
export interface DialogData {
  titulo: string;
  mensaje: string;
  IdsSolicitud: string;
  accion: number;
}

export interface ServcioElement {
  Codigo: string;
  Nombre: string;
  PrecioUnitario: Number;
  NombreMoneda: String;
}


@Component({
  selector: 'app-dialogo-tarifariodelservicio',
  templateUrl: './dialogo-tarifariodelservicio.component.html',
  styleUrls: ['./dialogo-tarifariodelservicio.component.css']
})
export class DialogoTarifarioDelServicioComponent implements OnInit {
  @ViewChild('select') select!: MatSelect;


  ELEMENT_DATA: ServcioElement[] = [];
  filteredELEMENT_DATA!: Observable<ServcioElement[]>;

  mode = new UntypedFormControl('side');
  isLoading = false;
  //IdsClientes: string = "";
  IdSolicitud: number = 0;
  datosBasicosFormGroup!: UntypedFormGroup;
  servicioCtrl = new UntypedFormControl('');
  listMoneda: any = [];
  listTarifado: any = [];
  listServicio: any = [];
  listUnidadMedida: any = [];
  material: any;
  IdTarifadoMaterial: number = 0;
  constructor(
    private solicitudesService: SolicitudesService,
    private listavaloresService: ListavaloresService,
    private _formBuilder: UntypedFormBuilder,
    //private _authService: AuthService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    public dialogo: MatDialogRef<DialogoTarifarioDelServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.IdSolicitud = data.IdSolicitud;
    this.material = data.material;
    //this.IdsClientes = data.IdsCliente.toString();
    //this.initfilteredELEMENT_DATA_SERVICIO();
  }

  private initfilteredELEMENT_DATA_SERVICIO() {
    this.filteredELEMENT_DATA = this.servicioCtrl.valueChanges.pipe(
      startWith(''),
      map(proveedor => {
        proveedor = (proveedor instanceof Object) ? proveedor : { Id: 0, Nombre: proveedor };
        return (proveedor ? this.filterStatesServicio(proveedor) : this.ELEMENT_DATA.slice())
      }),
    );

  }
  private filterStatesServicio(value: ServcioElement): ServcioElement[] {

    const filterValue = value.Nombre.toLowerCase();
    return this.ELEMENT_DATA.filter((state: any) => state.Nombre.toLowerCase().includes(filterValue));
  }
  displayFnNombreServicio(user: ServcioElement): string {
    return user && user.Nombre ? user.Nombre : '';
  }

  searchServicio(): void {

    if (this.datosBasicosFormGroup.value.tarifarioCtrl == "") {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione Tarifario");
    } else {
      this.buscarServicio(this.datosBasicosFormGroup.value.tarifarioCtrl);
    }

  }
  buscarServicio(IdTarifario: number): void {
    this.solicitudesService.getListarServiciosDelTarifario(IdTarifario).then((respuesta) => {
      this.ELEMENT_DATA = respuesta;
      this.initfilteredELEMENT_DATA_SERVICIO();
    });
  }

  async matAutocompleteSeleccionServicio(event: any) {
    var unidad = this.listUnidadMedida.find((x: any) => { return x.Id === this.datosBasicosFormGroup.value.servicioCtrl.IdUnidadMedida })
    this.datosBasicosFormGroup.patchValue({
      precioTotalCtrl: this.datosBasicosFormGroup.value.servicioCtrl.PrecioUnitario * 1,
      preciounitarioCtrl: this.datosBasicosFormGroup.value.servicioCtrl.PrecioUnitario,
      materialCtrl: unidad.Nombre,
      cantidadCtrl: 1,
    });
  }


  listarUnidadMedida() {
    this.listavaloresService.getListaValores({
      idlista: eLista.UnidadMedida,
      idcliente: ""
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listUnidadMedida = respuesta.ListaEntidadComun;
      }
    });
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
  listarTarifado() {
    this.solicitudesService.getListarTarifarioServicio(this.IdSolicitud).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listTarifado = respuesta.ListaEntidadComun;
      }
    });
  }
  onSelectEventTarifario(IdTarifario: any) {

    if (IdTarifario == 0) {
      this.listServicio = [];
    } else {
      this.searchServicio();
    }
  }

  onKeyUpCantidad(event: any) {
    var preciounitario = this.datosBasicosFormGroup.value.preciounitarioCtrl == null ? 0 : this.datosBasicosFormGroup.value.preciounitarioCtrl;
    this.datosBasicosFormGroup.patchValue({
      precioTotalCtrl: event.target.value * preciounitario
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
    var request: any = {
      idsolicitud: this.IdSolicitud,
      idTarifario: this.datosBasicosFormGroup.value.tarifarioCtrl,
      cantidad: this.datosBasicosFormGroup.value.cantidadCtrl
    }   
    this.dialogo.close({
      respuesta: true,
      request: request
    });
  }

  ngOnInit() {
    this.listarMoneda();
    this.listarTarifado();
    this.listarUnidadMedida();
    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      servicioCtrl: this.servicioCtrl,
      tarifarioCtrl: ['', Validators.required],
      materialCtrl: [''],
      //unidadCtrl: ['', Validators.required],
      preciounitarioCtrl: ['', Validators.required],
      monedaCtrl: ['', Validators.required],
      cantidadCtrl: ['', Validators.required],
      precioTotalCtrl: ['']
    }); 
  }
}
