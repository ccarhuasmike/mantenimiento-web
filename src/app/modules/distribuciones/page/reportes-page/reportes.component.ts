import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DistribucionesService } from '../../services/distribuciones.service';
import { AuthService } from "@core/auth/auth.service";
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { MatDialog } from "@angular/material/dialog";
import { FormControl } from '@angular/forms';
import {
  eEstadoSolicitud
} from "@core/types/formatos.types";
import { ClienteService } from '@shared/services/cliente.service';
export interface Fruit {
  name: string;
}
import { CookieService } from 'ngx-cookie-service';
import { BootstrapNotifyBarService } from '@shared/services/bootstrap-notify.service';
import { Chart, registerables } from 'chart.js';
import { ListavaloresService } from '@shared/services/listavalores.service';
Chart.register(...registerables);
//https://www.chartjs.org/docs/3.9.1/charts/doughnut.html
//https://stackblitz.com/edit/angular-material-multi-select?file=app%2Fselect-multiple-example.html
@Component({
  selector: 'app-missolicitudes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [CookieService]
})
export class ReportesComponent implements OnInit, OnDestroy {
  /** flags to set the toggle all checkbox state */
  toppings = new FormControl();

  toppingList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  selectedEstados: any;
  selectedPaqueteria: any;

  listaEstado: any;
  listaPaqueteria: any;

  canvasOrdenesKilos: any;
  ctxOrdenesKilos: any;
  @ViewChild('rpt1') pieCanvasOrdenesKilos!: { nativeElement: any };
  pieChartOrdenesKilos: any;


  canvasCumplimientoxZonales: any;
  ctxCumplimientoxZonales: any;
  @ViewChild('rpt2') pieCanvasCumplimientoxZonales!: { nativeElement: any };
  pieChartCumplimientoxZonales: any;

  canvasSolicitudPorEstado: any;
  ctxSolicitudPorEstado: any;
  @ViewChild('rpt3') pieCanvasSolicitudPorEstado!: { nativeElement: any };
  pieChartSolicitudPorEstado: any;

  canvasEncuesta: any;
  ctxEncuesta: any;
  @ViewChild('rpt4') pieCanvasEncuesta!: { nativeElement: any };
  pieChartEncuesta: any;

  eEstadoSolicitud = eEstadoSolicitud;
  fechaHoy = new Date();
  matexpansionpanelfiltro: boolean = false;
  isLoading = false;

  public itemsPerPage: number = 10;
  public totalRegistros: number = 0;
  public currentPage: number = 0;
  listClienteSeteado: any = [];
  listSolicitanteSeteado: any = [];
  public dataSource: any;
  _filtroLocalStoreage: any = {};

  _filtroRangoFechasParaExtraer: any = {
    FechaRegDesde: this.sumarDias(new Date(), -30),
    FechaRegHasta: new Date()
  };

  _filtroSolicitudYKiloTransportadosAtendidas: any = {
    FechaRegDesde: this.sumarDias(new Date(), -300),
    FechaRegHasta: new Date()
  };
  _filtroCumplimientoOrdenesEntregarPorZonales: any = {
    FechaRegDesde: this.sumarDias(new Date(), -300),
    FechaRegHasta: new Date()
  };
  _filtroGraficoEnbaseEstado: any = {
    FechaRegDesde: this.sumarDias(new Date(), -300),
    FechaRegHasta: new Date()
  };
  _filtroGraficoEncuesta: any = {
    FechaRegDesde: this.sumarDias(new Date(), -300),
    FechaRegHasta: new Date()
  };
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
      //this.ngOnInit();
    });
  }


  sumarDias(fecha: Date, dias: number) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }
  ngOnDestroy(): void {
    //throw new Error('Method not implemented.');
  }
  async ngOnInit() {

    var respuesta = await this.listavaloresService.getListaValores({
      idlista: 184,
      idcliente: ""
    });

    if (respuesta.TipoResultado == 1) {
      this.listaEstado = respuesta.ListaEntidadComun;
    }

    var respuesta = await this.listavaloresService.getListaValores({
      idlista: 183,
      idcliente: ""
    });

    if (respuesta.TipoResultado == 1) {
      this.listaPaqueteria = respuesta.ListaEntidadComun;
    }

    //throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    this.ListarReporteOrdenesKilos();
    this.ListarCumplimientoxZonales();
    this.ListarCantidadSolicitudesxEstado();
    this.ListarCalificaciones();
  }

  async btnListarReporteDetallado() {
    var request = {
      IdCliente: 62,
      FechaDesde: this._filtroRangoFechasParaExtraer.FechaRegDesde === "" ? null : this.datePipe.transform(this._filtroRangoFechasParaExtraer.FechaRegDesde, 'yyyy-MM-dd'),
      FechaHasta: this._filtroRangoFechasParaExtraer.FechaRegHasta === "" ? null : this.datePipe.transform(this._filtroRangoFechasParaExtraer.FechaRegHasta, 'yyyy-MM-dd'),
      IdsEstados: this.selectedEstados === undefined ? [] :this.selectedEstados.map((x: any) => { return x.Id }),
      IdsPaqueteria: this.selectedPaqueteria === undefined ? [] : this.selectedPaqueteria.map((x: any) => { return x.Id }),
    };
    this.distribucionesService.DescargarReporteDetallado(request).then((res: any) => {
      if (res.TipoResultado === 1) {
        var bin = atob(res.archivo.arrArchivo);
        var ab = this.s2ab(bin); // from example above
        var blob = new Blob([ab], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = res.archivo.Nombre;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        this.bootstrapNotifyBarService.notifyWarning(res.Mensaje);
      }
    });
  }
  s2ab(s: any) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  async ListarReporteOrdenesKilos() {
    var res = await this.distribucionesService.ListarReporteOrdenesKilos({
      IdCliente: 62,
      FechaDesde: this._filtroSolicitudYKiloTransportadosAtendidas.FechaRegDesde === "" ? null : this.datePipe.transform(this._filtroSolicitudYKiloTransportadosAtendidas.FechaRegDesde, 'yyyy-MM-dd'),
      FechaHasta: this._filtroSolicitudYKiloTransportadosAtendidas.FechaRegHasta === "" ? null : this.datePipe.transform(this._filtroSolicitudYKiloTransportadosAtendidas.FechaRegHasta, 'yyyy-MM-dd')
    });
    this.canvasOrdenesKilos = this.pieCanvasOrdenesKilos.nativeElement;
    this.ctxOrdenesKilos = this.canvasOrdenesKilos.getContext('2d');
    if (this.pieChartOrdenesKilos != null) {
      this.pieChartOrdenesKilos.destroy();
    }

    this.pieChartOrdenesKilos = new Chart(this.ctxOrdenesKilos, {
      type: 'bar',
      data: res,
      options: {
        scales: {
          y: {
            ticks: {
              minRotation: 0,
            }
          }
        }
      }
    });
  }
  async ListarCumplimientoxZonales() {
    var res = await this.distribucionesService.ListarCumplimientoxZonales({
      IdCliente: 62,
      IdTipo: 344,
      FechaDesde: this._filtroCumplimientoOrdenesEntregarPorZonales.FechaRegDesde === "" ? null : this.datePipe.transform(this._filtroCumplimientoOrdenesEntregarPorZonales.FechaRegDesde, 'yyyy-MM-dd'),
      FechaHasta: this._filtroCumplimientoOrdenesEntregarPorZonales.FechaRegHasta === "" ? null : this.datePipe.transform(this._filtroCumplimientoOrdenesEntregarPorZonales.FechaRegHasta, 'yyyy-MM-dd')
    });
    this.canvasCumplimientoxZonales = this.pieCanvasCumplimientoxZonales.nativeElement;
    this.ctxCumplimientoxZonales = this.canvasCumplimientoxZonales.getContext('2d');
    if (this.pieChartCumplimientoxZonales != null) {
      this.pieChartCumplimientoxZonales.destroy();
    }
    this.pieChartCumplimientoxZonales = new Chart(this.ctxCumplimientoxZonales, {
      type: 'bar',
      data: res,
      options: {
        scales: {
          y: {
            ticks: {
              minRotation: 0,
            }
          }
        }
      }
    });
  }
  async ListarCantidadSolicitudesxEstado() {
    var res = await this.distribucionesService.ListarCantidadSolicitudesxEstado({
      IdCliente: 62,
      FechaDesde: this._filtroGraficoEnbaseEstado.FechaRegDesde === "" ? null : this.datePipe.transform(this._filtroGraficoEnbaseEstado.FechaRegDesde, 'yyyy-MM-dd'),
      FechaHasta: this._filtroGraficoEnbaseEstado.FechaRegHasta === "" ? null : this.datePipe.transform(this._filtroGraficoEnbaseEstado.FechaRegHasta, 'yyyy-MM-dd')
    });
    res.datasets[0].backgroundColor = [
      "#5ed082",
      "#3fbbff",
      "#ffe77f",
      "#ff815e"
    ];
    this.canvasSolicitudPorEstado = this.pieCanvasSolicitudPorEstado.nativeElement;
    this.ctxSolicitudPorEstado = this.canvasSolicitudPorEstado.getContext('2d');
    if (this.pieChartSolicitudPorEstado != null) {
      this.pieChartSolicitudPorEstado.destroy();
    }
    this.pieChartSolicitudPorEstado = new Chart(this.ctxSolicitudPorEstado, {
      type: 'doughnut',
      data: res,
      options: {
        radius: '60%',
        cutout: '60%',
        plugins: {
          title: {
            font: {
              size: 16,
            },
            color: '#000000',
          }
        }
      }
    });
  }
  async ListarCalificaciones() {

    var res = await this.distribucionesService.ListarCalificaciones({
      IdCliente: 62,
      FechaDesde: this._filtroGraficoEncuesta.FechaRegDesde === "" ? null : this.datePipe.transform(this._filtroGraficoEncuesta.FechaRegDesde, 'yyyy-MM-dd'),
      FechaHasta: this._filtroGraficoEncuesta.FechaRegHasta === "" ? null : this.datePipe.transform(this._filtroGraficoEncuesta.FechaRegHasta, 'yyyy-MM-dd')
    });
    this.canvasEncuesta = this.pieCanvasEncuesta.nativeElement;
    this.ctxEncuesta = this.canvasEncuesta.getContext('2d');
    if (this.pieChartEncuesta != null) {
      this.pieChartEncuesta.destroy();
    }
    this.pieChartEncuesta = new Chart(this.ctxEncuesta, {
      type: 'bar',
      data: res,
      options: {

      }
    });
  }

  btnGraficoEncuesta() {
    if (!moment.isDate(this._filtroGraficoEncuesta.FechaRegHasta)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha fin incorrecto.");
      return;
    }
    if (!moment.isDate(this._filtroGraficoEncuesta.FechaRegDesde)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha inicio incorrecto.");
      return;
    }
    if (this._filtroGraficoEncuesta.FechaRegHasta == null || this._filtroGraficoEncuesta.FechaRegDesde == null) {
      this.bootstrapNotifyBarService.notifyWarning("Ingrese rango de fechas.");
      return;
    }
    this.ListarCalificaciones();
  }
  btnGraficoGDEnBaseSuEstado() {

    if (!moment.isDate(this._filtroGraficoEnbaseEstado.FechaRegHasta)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha fin incorrecto.");
      return;
    }
    if (!moment.isDate(this._filtroGraficoEnbaseEstado.FechaRegDesde)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha inicio incorrecto.");
      return;
    }
    if (this._filtroGraficoEnbaseEstado.FechaRegHasta == null || this._filtroGraficoEnbaseEstado.FechaRegDesde == null) {
      this.bootstrapNotifyBarService.notifyWarning("Ingrese rango de fechas.");
      return;
    }
    this.ListarCantidadSolicitudesxEstado();
  }
  btnCumplimientoOrdenesEntregaPorZonales() {
    if (!moment.isDate(this._filtroCumplimientoOrdenesEntregarPorZonales.FechaRegHasta)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha fin incorrecto.");
      return;
    }
    if (!moment.isDate(this._filtroCumplimientoOrdenesEntregarPorZonales.FechaRegDesde)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha inicio incorrecto.");
      return;
    }
    if (this._filtroCumplimientoOrdenesEntregarPorZonales.FechaRegHasta == null || this._filtroCumplimientoOrdenesEntregarPorZonales.FechaRegDesde == null) {
      this.bootstrapNotifyBarService.notifyWarning("Ingrese rango de fechas.");
      return;
    }
    this.ListarCumplimientoxZonales();
  }
  btnSolicitudYKilosTransportados() {
    if (!moment.isDate(this._filtroSolicitudYKiloTransportadosAtendidas.FechaRegHasta)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha fin incorrecto.");
      return;
    }
    if (!moment.isDate(this._filtroSolicitudYKiloTransportadosAtendidas.FechaRegDesde)) {
      this.bootstrapNotifyBarService.notifyWarning("Fecha inicio incorrecto.");
      return;
    }
    if (this._filtroSolicitudYKiloTransportadosAtendidas.FechaRegHasta == null || this._filtroSolicitudYKiloTransportadosAtendidas.FechaRegDesde == null) {
      this.bootstrapNotifyBarService.notifyWarning("Ingrese rango de fechas.");
      return;
    }
    this.ListarReporteOrdenesKilos();
  }
}
