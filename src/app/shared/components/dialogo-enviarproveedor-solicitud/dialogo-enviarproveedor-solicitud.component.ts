import { Component, ViewChild, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from "@core/auth/auth.service";
import { DatePipe } from "@angular/common";
import { SolicitudesService } from "@modules/solicitudes/services/solicitudes.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ProveedorService } from "@shared/services/proveedor.service";
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators';
import { UntypedFormControl } from '@angular/forms';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import {
  TecnicoElement
} from "@shared/components/multiselecttecnico/modal-busqueda-tenico/modal-busqueda-tecnico.component";
import { TecnicoService } from "@shared/services/tecnico.service";
export interface ProveedorElement {
  Id: number;
  Nombre: string;
}

export interface DialogData {
  titulo: string;
  mensaje: string;
  IdsSolicitud: string;
  accion: number;
}
@Component({
  selector: 'app-dialogo-enviarproveedor-solicitud',
  templateUrl: './dialogo-enviarproveedor-solicitud.component.html',
  styleUrls: ['./dialogo-enviarproveedor-solicitud.component.css']
})
export class DialogoEnviarProveedorSolicutdComponent implements OnInit {
  isSubmitted: boolean = false;
  @ViewChild('select') select!: MatSelect;
  IdsClientes: string = "";
  IdSolicitud: number = 0;
  MontoPresupuesto: number = 0;

  SolicitarMontoConciliadoyPlazoTermino: boolean = false;
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEdi: any = {};
  ELEMENT_DATA: ProveedorElement[] = [];
  filteredELEMENT_DATA!: Observable<ProveedorElement[]>;
  proveedorCtrl = new UntypedFormControl('');
  montoConciliadoCtrl = new UntypedFormControl(['', Validators.required]);
  plazoestimadoterminoCtrl = new UntypedFormControl(['', Validators.required]);
  ELEMENT_DATA_TECNICO: TecnicoElement[] = [];
  selectedObjectsFromArray: any;
  allSelected = false;
  constructor(
    private tecnicoService: TecnicoService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private solicitudesService: SolicitudesService,
    private proveedorService: ProveedorService,
    private _formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private _authService: AuthService,
    public dialogo: MatDialogRef<DialogoEnviarProveedorSolicutdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initfilteredELEMENT_DATA_PROVEEDOR();
    this.IdSolicitud = data.IdSolicitud;
    this.IdsClientes = data.IdsCliente.toString();
    this.SolicitarMontoConciliadoyPlazoTermino = data.SolicitarMontoConciliadoyPlazoTermino;
    if (this.SolicitarMontoConciliadoyPlazoTermino) {
      this.MontoPresupuesto = data.MontoPresupuesto;
    }
  }

  private initfilteredELEMENT_DATA_PROVEEDOR() {
    this.filteredELEMENT_DATA = this.proveedorCtrl.valueChanges.pipe(
      startWith(''),
      map(proveedor => {
        proveedor = (proveedor instanceof Object) ? proveedor : { Id: 0, Nombre: proveedor };
        return (proveedor ? this.filterStatesProveedor(proveedor) : this.ELEMENT_DATA.slice())
      }),
    );

  }
  private filterStatesProveedor(value: ProveedorElement): ProveedorElement[] {

    const filterValue = value.Nombre.toLowerCase();
    return this.ELEMENT_DATA.filter((state: any) => state.Nombre.toLowerCase().includes(filterValue));
  }
  displayFnNombreProveedor(user: ProveedorElement): string {
    return user && user.Nombre ? user.Nombre : '';
  }
  searchProveedor(): void {
    this.buscarProveedor("");
  }
  buscarProveedor(nombre: string): void {
    this.proveedorService.getProveedorFiltro({
      idcliente: this.IdsClientes,
      nombre: "",
    }).then((res: any) => {
      this.ELEMENT_DATA = res;
      this.initfilteredELEMENT_DATA_PROVEEDOR();
    }, error => {
    });
  }

  async matAutocompleteSeleccionProveedor(event: any) {
    this.tecnicoService.getTecnicos({
      IdsCliente: this.IdsClientes,
      IdsProveedor: event.Id.toString(),
      Nombre: ""
    }).then((res: any) => {
      if (res.TipoResultado == 1) {
        this.ELEMENT_DATA_TECNICO = res.ListaUsuarios;
      } else {
        this.ELEMENT_DATA_TECNICO = [];
      }
    }, error => { });
  }


  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }
  confirmado(): void {
    if (!this.datosBasicosFormGroup.valid)
      return;
    
    var request = {
      IdSolicitud: this.IdSolicitud,
      IdProveedor: this.datosBasicosFormGroup.value.proveedorCtrl.Id,
      lstTecnicos: this.datosBasicosFormGroup.value.selectedObjectsFromArray == null ? [] : this.datosBasicosFormGroup.value.selectedObjectsFromArray,
      MontoConciliadoRequerimiento :null,
      PlazoEjecucionRequerimiento : null
    }

    if (this.SolicitarMontoConciliadoyPlazoTermino) {
      if (this.datosBasicosFormGroup.value.montoConciliadoCtrl > this.MontoPresupuesto) {
        this.bootstrapNotifyBarService.notifyWarning("El monto conciliado no debe ser mayor al monto aprobado del presupuesto.");
        return;
      } else {
        request.MontoConciliadoRequerimiento = this.datosBasicosFormGroup.value.montoConciliadoCtrl;
        request.PlazoEjecucionRequerimiento = this.datosBasicosFormGroup.value.plazoestimadoterminoCtrl;
      }
    }//

    this.isSubmitted = true;    
    this.solicitudesService.EnviarAlProveedor(request).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.bootstrapNotifyBarService.notifySuccess(respuesta.Mensaje);
        this.isSubmitted = false;
        this.dialogo.close({
          respuesta: true
        });
      }
    }, error => {
      this.bootstrapNotifyBarService.notifyDanger("Por favor, comunicarse con el Administrador del Sistema");
    });
  }

  ngOnInit() {
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.datosBasicosFormGroup = this._formBuilder.group({
      proveedorCtrl: this.proveedorCtrl,
      selectedObjectsFromArray: [null]
    });
    if (this.SolicitarMontoConciliadoyPlazoTermino) {
      this.datosBasicosFormGroup.addControl('montoConciliadoCtrl', this._formBuilder.control('', [Validators.required]));
      this.datosBasicosFormGroup.addControl('plazoestimadoterminoCtrl', this._formBuilder.control('', [Validators.required]));      
    }
    this.buscarProveedor("");
  }
}
