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
  selector: 'app-dialogo-servicioprecario',
  templateUrl: './dialogo-servicioprecario.component.html',
  styleUrls: ['./dialogo-servicioprecario.component.css']
})
export class DialogoServicioPrecarioComponent implements OnInit {
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
  listTipoDocumento: any = [];
  servicio: any;
  IdGastoServicio: number = 0;

  constructor(
    private solicitudesService: SolicitudesService,
    private listavaloresService: ListavaloresService,
    private _formBuilder: UntypedFormBuilder,

    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    public dialogo: MatDialogRef<DialogoServicioPrecarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.IdSolicitud = data.IdSolicitud;
    this.servicio = data.servicio;

  }

  listarTipoDocumento() {
    this.listavaloresService.getListaValores({
      idlista: eLista.MaterialesTipoDocumento,
      idcliente: ""
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listTipoDocumento = respuesta.ListaEntidadComun;
      }
    });
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

    //monedaCtrl
    var unidad = this.listUnidadMedida.find((x: any) => { return x.Id === this.datosBasicosFormGroup.value.servicioCtrl.IdUnidadMedida })
    this.datosBasicosFormGroup.patchValue({
      precioTotalCtrl: this.datosBasicosFormGroup.value.servicioCtrl.PrecioUnitario * 1,
      preciounitarioCtrl: this.datosBasicosFormGroup.value.servicioCtrl.PrecioUnitario,
      materialTextCtrl: unidad.Nombre,
      cantidadCtrl: 1,
      monedaTextCtrl: this.datosBasicosFormGroup.value.servicioCtrl.NombreMoneda

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
  listarPreciarios() {

    this.solicitudesService.getListarPreciarios(this.IdSolicitud).then((respuesta) => {

      if (respuesta.TipoResultado == 1) {
        this.listTarifado = respuesta.ListaEntidadComun;
      }
    });
  }
  mostrarControlesNoAplica: boolean = false;
  onSelectEventTarifario(IdTarifario: any) {
    if (IdTarifario == 9999) {
      this.mostrarControlesNoAplica = true;
      this.datosBasicosFormGroup.addControl('TipoDocumentoCtrl', this._formBuilder.control('', [Validators.required]));
      this.datosBasicosFormGroup.addControl('serieCtrl', this._formBuilder.control('', [Validators.required]));
      this.datosBasicosFormGroup.addControl('numeroDocumentoCtrl', this._formBuilder.control('', [Validators.required]));
      this.datosBasicosFormGroup.addControl('materialCtrl', this._formBuilder.control('', [Validators.required]));
      this.datosBasicosFormGroup.addControl('monedaCtrl', this._formBuilder.control('', [Validators.required]));
      this.datosBasicosFormGroup.removeControl('servicioCtrl');

      
      
    } else {
      this.datosBasicosFormGroup.addControl('servicioCtrl', this.servicioCtrl);   
      this.datosBasicosFormGroup.removeControl('materialCtrl');       
      this.datosBasicosFormGroup.removeControl('monedaCtrl');      
      this.datosBasicosFormGroup.removeControl('TipoDocumentoCtrl');
      this.datosBasicosFormGroup.removeControl('serieCtrl');
      this.datosBasicosFormGroup.removeControl('numeroDocumentoCtrl');
      this.mostrarControlesNoAplica = false;
      if (IdTarifario == 0) {
        this.listServicio = [];
      } else {
        this.searchServicio();
      }
    }
  }

  onKeyUpPrecioUnitario(event: any) {
    var cantidad = this.datosBasicosFormGroup.value.cantidadCtrl == null ? 0 : this.datosBasicosFormGroup.value.cantidadCtrl;
    this.datosBasicosFormGroup.patchValue({
      precioTotalCtrl: event.target.value * cantidad
    });
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
    //this.bootstrapNotifyBarService.notifyWarning(respuesta.Mensaje);
    
    var request: any = {};
    if (this.datosBasicosFormGroup.value.tarifarioCtrl === 9999) {
      request.idsolicitud= this.IdSolicitud;
      request.idTarifario= null;
      request.cantidad= this.datosBasicosFormGroup.value.cantidadCtrl;
      request.idUnidadMedida= this.datosBasicosFormGroup.value.materialCtrl;
      request.PrecioUnitario= this.datosBasicosFormGroup.value.preciounitarioCtrl;
      request.IdMoneda= this.datosBasicosFormGroup.value.monedaCtrl;
      request.Comentarios= this.datosBasicosFormGroup.value.descripcionDetalladaCtrl;      
      request.IdTipoDocumento= this.datosBasicosFormGroup.value.TipoDocumentoCtrl;
      request.SerieDocumento= this.datosBasicosFormGroup.value.serieCtrl;
      request.NumeroDocumento= this.datosBasicosFormGroup.value.numeroDocumentoCtrl;
    } else {
      request.idsolicitud= this.IdSolicitud;
      request.idTarifario= this.datosBasicosFormGroup.value.servicioCtrl.Id;
      request.cantidad= this.datosBasicosFormGroup.value.cantidadCtrl;
      request.Comentarios= this.datosBasicosFormGroup.value.descripcionDetalladaCtrl;
    } 
    if (this.IdGastoServicio == 0) {
      this.dialogo.close({
        respuesta: true,
        request: request
      });
    } else {
      request.Id = this.IdGastoServicio;
      this.dialogo.close({
        respuesta: true,
        request: request
      });


    }
  }

  ngOnInit() {
    
    this.listarMoneda();
    this.listarPreciarios();
    this.listarUnidadMedida();
    this.listarTipoDocumento();
    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      servicioCtrl : this.servicioCtrl,
      tarifarioCtrl: ['', Validators.required],
      materialTextCtrl: [''],        
      preciounitarioCtrl: ['', Validators.required],
      monedaTextCtrl: [''],      
      cantidadCtrl: ['', Validators.required],
      precioTotalCtrl: [''],
      descripcionDetalladaCtrl: ['', Validators.required]          
    });
   

    if (this.servicio === null) {
      this.datosBasicosFormGroup.patchValue({
        unidadCtrl: 16,
        monedaCtrl: "",
        cantidadCtrl: 1
      });
    } else {
      this.IdGastoServicio = this.servicio.Id;
      if(this.servicio.IdPreciario ===null){//Tipo perciario No Aplica
        this.onSelectEventTarifario(9999) ;
        this.datosBasicosFormGroup.patchValue({
          TipoDocumentoCtrl: this.servicio.IdTipoDocumento,
          serieCtrl:this.servicio.SerieDocumento,
          numeroDocumentoCtrl:this.servicio.NumeroDocumento,
          materialCtrl: this.servicio.IdUnidadMedida,
          monedaCtrl:this.servicio.IdMoneda,
          descripcionDetalladaCtrl : this.servicio.Descripcion,
          tarifarioCtrl : 9999,
          preciounitarioCtrl: this.servicio.PrecioUnitario,
          precioTotalCtrl: this.servicio.MontoTotal,
          cantidadCtrl: this.servicio.Cantidad         
        });
      }else{
        this.datosBasicosFormGroup.patchValue({
          tarifarioCtrl: this.servicio.IdPreciario,
          materialTextCtrl: this.servicio.NombreUnidadMedida,         
          preciounitarioCtrl: this.servicio.PrecioUnitario,
          precioTotalCtrl: this.servicio.MontoTotal,
          monedaTextCtrl: this.servicio.NombreMoneda,
          cantidadCtrl: this.servicio.Cantidad,
          descripcionDetalladaCtrl : this.servicio.Descripcion,
        });
      }     
    }
  }
}
