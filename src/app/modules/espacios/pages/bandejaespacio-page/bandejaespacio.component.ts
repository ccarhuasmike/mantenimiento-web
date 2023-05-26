import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EspaciosService } from '../../services/espacio.service';
import { AuthService } from "@core/auth/auth.service";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { DialogoPreviewQRComponent } from '@shared/components/dialogo-previewqr/dialogo-previewqr.component';
import { AforoPorInmueble, Inmueble } from '../registroespacios-page/registroespacios.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SelectionModel } from "@angular/cdk/collections";
import { BootstrapNotifyBarService } from '@shared/services/bootstrap-notify.service';

@Component({
  selector: 'app-bandejaespacio',
  templateUrl: './bandejaespacio.component.html',
  styleUrls: ['./bandejaespacio.component.css']
})
export class BandejaEspaciosComponent implements OnInit, OnDestroy {
  listInmueble: Inmueble[] = [];

  aforoPorInmueble: AforoPorInmueble = {
    aforoAuto: '0/0',
    aforoBicicleta: '0/0',
    aforoMoto: '0/0',
    aforoPersona: '0/0',
    flagConformidadVacunas: false,
    tieneAuto: false,
    placaAuto: "",
    tieneMoto: false,
    placaMoto: "",
  };

  matexpansionpanelfiltro: boolean = false;
  isLoading = false;
  public itemsPerPage: number = 10;
  public totalRegistros: number = 0;
  public currentPage: number = 0;
  listClienteSeteado: any = [];
  listSolicitanteSeteado: any = [];
  public dataSource: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | undefined;
  selectionTarifadoServicio = new SelectionModel<any>(true, []);
  dateRange = new UntypedFormGroup({
    Codigo: new UntypedFormControl(''),
    startDate: new UntypedFormControl(),
    endDate: new UntypedFormControl(),
  });
  _filtroLocalStoreage: any = {};
  _filtro: any = {
    IdInmueble: '',
    FechaRegDesde: new Date(),
    FechaRegHasta: this.sumarDias(new Date(), 7)
  };

  selectable = true;
  selected!: any;

  datosEdi: any = {};
  displayedColumns: string[] =
    [
      'select',
      'Solicitante',
      'FechaReserva',
      'Horario',
      'IncluyeEstacionamiento',
      'CheckIn',
      'QR',
      'estado',
      'Motivo',
    ];

  constructor(
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    public dialogo: MatDialog,
    private espaciosService: EspaciosService,
    private datePipe: DatePipe,
    private _authService: AuthService
  ) {
  }
  sumarDias(fecha: Date, dias: number) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }
  btnPreviewQR(item: any) {    
    this.dialogo.open(DialogoPreviewQRComponent, {
      panelClass: 'modal-md',
      disableClose: true,
      data: item
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => { });
  }
  btnCancelarReserva() {
    if (this.selectionTarifadoServicio.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione al menos un registro");
      return;
    }
    
    this.espaciosService.postCancelarReserva(this.selectionTarifadoServicio.selected).then((response) => {
      if (response.success) {
        this.bootstrapNotifyBarService.notifySuccess(response.message);
        this.loadDatos();
        this.selectionTarifadoServicio.selected.forEach((row: any) => {
          this.selectionTarifadoServicio.deselect(row);
        });
      } else {
        this.bootstrapNotifyBarService.notifyWarning(response.message);
      }
    });
  }
  btnCheckIn() {
    if (this.selectionTarifadoServicio.selected.length === 0) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione al menos un registro");
      return;
    }

    this.espaciosService.postCheckingReserva(this.selectionTarifadoServicio.selected).then((response) => {
      if (response.success) {
        this.bootstrapNotifyBarService.notifySuccess(response.message);
        this.loadDatos();
      } else {
        this.bootstrapNotifyBarService.notifyWarning(response.message);
      }
    });
  }

  /**Si el número de elementos seleccionados coincide con el número total de filas. */
  public isAllSelectedTarifadoServicio() {
    const numSelected = this.selectionTarifadoServicio.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selecciona todas las filas si no están todas seleccionadas; de lo contrario borrar la selección. */
  public masterToggleTarifadoServicio() {
    this.isAllSelectedTarifadoServicio() ?
      this.selectionTarifadoServicio.clear() :
      this.dataSource.forEach((row: any) => this.selectionTarifadoServicio.select(row));
  }

  /**Si el número de elementos seleccionados coincide con el número total de filas. */
  public isAllSelectedTarifadoMateriales() {
    const numSelected = this.dataSource.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  async logMonth($event: MatDatepickerInputEvent<Date>) {
    
    this.selected = $event.value;
    await this.ObtenerAforo({ id: this._filtro.IdInmueble }, (this.selected == null || this.selected == undefined ? new Date() : this.selected));
  }
  async onSelectEventInmueble(value: any) {
    this.selected = (this._filtro.FechaRegDesde == null || this._filtro.FechaRegDesde == undefined || this._filtro.FechaRegDesde == "" ? new Date() : this._filtro.FechaRegDesde)
    await this.ObtenerAforo({ id: value }, this.selected);
  }
  async ObtenerAforo(value: any, date: any) {

    var request = {
      IdInmueble: value.id,
      Fecha: this.datePipe.transform(date, 'yyyy-MM-dd'),
      IdCliente: this.datosEdi.IdCliente
    };
    var response = await this.espaciosService.postObtenerAforoPorInmueble(request);

    if (response.success)
      this.aforoPorInmueble = response.body;
  }


  async LimpiarControles() {
    this._filtro.IdInmueble = '';
    this._filtro.FechaRegHasta = '';
    this._filtro.FechaRegDesde= new Date(),
    this._filtro.FechaRegHasta= this.sumarDias(new Date(), 7)

    /*resetear el filtro de inmuebles */
    var existInmuebleAGCERESMATRIZ: any = this.listInmueble.find((x: any) => { return x.nombre === 'SEDE HATUN WASI' });
    /*Si en el listo de inmueble encontramos SEDE HATUN WASI seteamos por default el combo  */
    this._filtro.IdInmueble = existInmuebleAGCERESMATRIZ !== null || existInmuebleAGCERESMATRIZ !== undefined ? existInmuebleAGCERESMATRIZ.id : "";
   
    if(this._filtro.IdInmueble!==""){
      this.selected = (this._filtro.FechaRegDesde == null || this._filtro.FechaRegDesde == undefined || this._filtro.FechaRegDesde == "" ? new Date() : this._filtro.FechaRegDesde)
      await this.ObtenerAforo({ id: this._filtro.IdInmueble }, this.selected);
    }
    
  }
  cargarSedeLocales() {
    this.espaciosService.getObtenerInmuebles(62).then(async (respuesta) => {
      this.listInmueble = respuesta;
      var existInmuebleAGCERESMATRIZ: any = this.listInmueble.find((x: any) => { return x.nombre === 'SEDE HATUN WASI' });
      /*Si en el listo de inmueble encontramos SEDE HATUN WASI seteamos por default el combo  */
      this._filtro.IdInmueble = existInmuebleAGCERESMATRIZ !== null || existInmuebleAGCERESMATRIZ !== undefined ? existInmuebleAGCERESMATRIZ.id : "";
     
      if(this._filtro.IdInmueble!==""){
        this.selected = (this._filtro.FechaRegDesde == null || this._filtro.FechaRegDesde == undefined || this._filtro.FechaRegDesde == "" ? new Date() : this._filtro.FechaRegDesde)
        await this.ObtenerAforo({ id: this._filtro.IdInmueble }, this.selected);
      }
      this.loadDatos();
    });
  }

  loadDatos(): void {
    var request = {
      filtro: {
        idinmueble: this._filtro.IdInmueble === '' ? null : parseInt(this._filtro.IdInmueble),
        fechaInicio: this.datePipe.transform(this._filtro.FechaRegDesde, 'yyyy-MM-dd'),
        fechaFin: this.datePipe.transform(this._filtro.FechaRegHasta, 'yyyy-MM-dd')
      },
      page: 0,
      pageSize: 10
    }
    this.isLoading = true;
    this.dataSource = [];
    this.matexpansionpanelfiltro = true;    
    this.espaciosService.BandejaReservaPaginado(request).then((res) => {
      this.isLoading = false;
      this.dataSource = res.data;
      this.totalRegistros = res.totalRecordsD;
      this.selectionTarifadoServicio.clear();
      this.dataSource.forEach((row: any) => this.selectionTarifadoServicio.deselect(row));
    });
  }
  

  pageChanged(event: any): void {
    this.currentPage = event.pageIndex;
    this.loadDatos();
  };
  //#endregion

  ngOnDestroy(): void {
    localStorage.setItem('_filtroLocalStoreageSolicitudes', JSON.stringify(this._filtroLocalStoreage));
  }

  ngOnInit(): void {
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.cargarSedeLocales();
  }
}
