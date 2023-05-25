import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import { Gallery, GalleryRef, GalleryItem, ImageItem } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { EspaciosService } from "@modules/espacios/services/espacio.service";
import { Router } from "@angular/router";
import { ListavaloresService } from "@shared/services/listavalores.service";
import { DatePipe } from "@angular/common";
import { AuthService } from "@core/auth/auth.service";
import { DialogoConfigUsuarioEspaciosComponent } from '@shared/components/dialogo-config-usuarioespacios/dialogo-config-usuarioespacios.component'; export interface Inmueble {
  id: Number;
  nombre: string;
  idEdificio: Number;
  idNivel: Number;
}


export interface AforoPorInmueble {
  aforoPersona: string;
  aforoAuto: string;
  aforoMoto: string;
  aforoBicicleta: string;
  flagConformidadVacunas: boolean;
  tieneAuto: boolean;
  placaAuto: string;
  tieneMoto: boolean;
  placaMoto: string;
}

const data = [
  {
    srcUrl: './assets/img/ambiente-mibanco/AREA_DE_INTEGRACION.jpg',
    previewUrl: './assets/img/ambiente-mibanco/AREA_DE_INTEGRACION.jpg',
    title: "Área de Integración"
  },
  {
    srcUrl: './assets/img/ambiente-mibanco/CABINA_INDIVIDUAL.jpg',
    previewUrl: './assets/img/ambiente-mibanco/CABINA_INDIVIDUAL.jpg',
    title: "Cabina Individual"
  },
  {
    srcUrl: './assets/img/ambiente-mibanco/COMEDOR.jpg',
    previewUrl: './assets/img/ambiente-mibanco/COMEDOR.jpg',
    title: "Área de Comedor"
  },
  {
    srcUrl: './assets/img/ambiente-mibanco/PROCESOS.jpg',
    previewUrl: './assets/img/ambiente-mibanco/PROCESOS.jpg',
    title: "Área de Procesos"
  },
  {
    srcUrl: './assets/img/ambiente-mibanco/SALA_DE_REUNIONES.jpg',
    previewUrl: './assets/img/ambiente-mibanco/SALA_DE_REUNIONES.jpg',
    title: "Sala de Reuniones"
  },
  {
    srcUrl: './assets/img/ambiente-mibanco/ZONA_DE_TRABAJO.jpg',
    previewUrl: './assets/img/ambiente-mibanco/ZONA_DE_TRABAJO.jpg',
    title: "Zona de Trabajo"
  }
];

@Component({
  selector: 'app-registroespacios',
  templateUrl: 'registroespacios.component.html',
  styleUrls: ['registroespacios.component.css'],

})

export class RegistroespaciosComponent implements OnInit {

  selectedLanguage = '';
  selectHoras = 0;

  maxDate = new Date();
  minDate = new Date();
  @ViewChild('itemTemplate') itemTemplate!: TemplateRef<any>;
  items!: GalleryItem[];
  imageData = data;
  datosEdi: any = {};
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
  userForm!: FormGroup;
  selected: any = new Date;
  listInmueble: Inmueble[] = [];
  listHora: any[] = [];
  listModalidadLaboral: any[] = [];
  listMotivoReserva: any[] = [];
  showIdIconPlacas: boolean = false;
  showPlacaAuto: boolean = false;
  showPlacaMoto: boolean = false;
  tieneBicicleta: boolean = false;
  disabledbtnSolicitarReserva: boolean = false;
  datosBasicosFormGroup!: UntypedFormGroup;
  disabledHoras: boolean = false;
  constructor(
    public dialogo: MatDialog,
    private datePipe: DatePipe,
    private listavaloresService: ListavaloresService,
    public router: Router,
    private espaciosService: EspaciosService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private formBuilder: FormBuilder,
    public gallery: Gallery, public lightbox: Lightbox,
    public dialog: MatDialog,
    private _authService: AuthService
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 14);
  }

  btnModalConfigUsuarioEspacios_Click() {
    this.dialogo.open(DialogoConfigUsuarioEspaciosComponent, {
      maxWidth: '40vw',
      maxHeight: '98vh',
      height: '98vh',
      width: '40%',
      disableClose: true,
      data: {
        IdSolicitud: 0,
        titulo: `Configuración`,
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if (confirmado.respuesta) {
          this.espaciosService.postInsertarConfigUsuariosEspacios(confirmado.request).then((response) => {
            if (response.success) {
              this.bootstrapNotifyBarService.notifySuccess(response.body.mensaje);
            } else {
              this.bootstrapNotifyBarService.notifyWarning(response.body.mensaje);
            }
          });
        }
      });
  }

  btnMostrarPlacaAuto() {
    this.selectedLanguage = 'auto';
    this.showPlacaAuto = !this.showPlacaAuto;
    if (this.showPlacaAuto){
      this.datosBasicosFormGroup.removeControl('numeroplaca');
      this.datosBasicosFormGroup.addControl('numeroplaca', this.formBuilder.control(this.aforoPorInmueble.tieneAuto ? this.aforoPorInmueble.placaAuto : "", [Validators.required]));
    }
    else
      this.datosBasicosFormGroup.removeControl('numeroplaca');
    this.showPlacaMoto = false;
    this.tieneBicicleta = false;
  }
  btnMostrarPlacaMoto() {
    this.selectedLanguage = 'moto';
    this.showPlacaMoto = !this.showPlacaMoto;
    if (this.showPlacaMoto){
      this.datosBasicosFormGroup.removeControl('numeroplaca');
      this.datosBasicosFormGroup.addControl('numeroplaca', this.formBuilder.control(this.aforoPorInmueble.tieneMoto ? this.aforoPorInmueble.placaMoto : "", [Validators.required]));
    }      
    else
      this.datosBasicosFormGroup.removeControl('numeroplaca');
    this.showPlacaAuto = false;
    this.tieneBicicleta = false;
  }
  btnMostrarbicicleta() {
    this.selectedLanguage = 'bicicleta';
    this.tieneBicicleta = !this.tieneBicicleta;
    this.showPlacaMoto = false;
    this.showPlacaAuto = false;
    this.datosBasicosFormGroup.removeControl('numeroplaca');
  }
  date = new Date();
  async logMonth($event: any) {
    this.selected = $event
    this.ObtenerAforo(this.datosBasicosFormGroup.value.inmuebleCtrl, (this.selected == null || this.selected == undefined ? new Date() : this.selected));

    /*si la fecha seleccionada es mayor a la fecha actual se genera nuevo horarios de 9:00 am a 18:30pm */
    if (this.selected > new Date()) {
      this.listHora = [];
      const start = new Date();
      start.setHours(9, 0, 0); //9 AM
      const end = new Date();
      end.setHours(18, 30, 0); //6:30 PM      
      var contadorTime = 0;
      while (start <= end) {
        contadorTime++;
        var fechaHoraCalculado = new Date(start);
        this.listHora.push({ id: contadorTime, valor: fechaHoraCalculado });
        start.setMinutes(start.getMinutes() + 30);
      }
    } else {
      this.listHora = [];
      const start = new Date();
      var minutos = start.getMinutes() > 0 && start.getMinutes() < 30 ? 30 : 0;
      start.setHours(minutos == 0 ? start.getHours() + 1 : start.getHours(), minutos, 0); //8 AM
      const end = new Date();
      end.setHours(19, 0, 0); //11 PM      
      var contadorTime = 0;
      while (start <= end) {
        contadorTime++;
        var fechaHoraCalculado = new Date(start);
        this.listHora.push({ id: contadorTime, valor: fechaHoraCalculado });
        start.setMinutes(start.getMinutes() + 30);
      }
    }

  }
  onSelectEventInmueble(value: any) {
    this.ObtenerAforo(value, (this.selected == null || this.selected == undefined ? new Date() : this.selected));
  }
  ObtenerAforo(value: any, date: any) {
    var request = {
      IdInmueble: value.id,
      Fecha: this.datePipe.transform(date, 'yyyy-MM-dd'),
      IdUsuario: this.datosEdi.Id,
      IdCliente: this.datosEdi.IdCliente
    };

    if (value.id !== undefined) {
      this.espaciosService.postObtenerAforoPorInmueble(request).then((response) => {
        if (response.success) {
          this.aforoPorInmueble = response.body;
          if (this.aforoPorInmueble.flagConformidadVacunas)
            this.onChkChangeAcepteTerminoCondiciones(this.aforoPorInmueble.flagConformidadVacunas);
        }
      });
    }
  }

  onSelectEventTodoElDia(value: any) {

    this.selectHoras = 0;
    //var listHoraAOrdenar=  Object.assign({}, this.listHora);
    let listHoraAOrdenar = [...this.listHora];
    //var listHoraAOrdenar=this.listHora;
    let listHoraOrdenado = listHoraAOrdenar.sort((first, second) => 0 - (first.id > second.id ? 1 : -1));

    this.disabledHoras = value.checked;
    this.datosBasicosFormGroup.patchValue({
      horaFinCtrl: value.checked ? listHoraOrdenado[0].id : 1
    });
  }

  galleryId = 'mixedExample';
  ngOnInit(): void {
    this.datosEdi = JSON.parse(this._authService.accessEdi);

    this.espaciosService.ValidaExisteUsuario({ IdUsuario: this.datosEdi.Id }).then((response) => {

      if (response.success) {
        if (response.message === 'No existe')
          this.btnModalConfigUsuarioEspacios_Click();
      } else
        this.bootstrapNotifyBarService.notifyWarning(response.body.mensaje);
    });

    const start = new Date();
    var minutos = start.getMinutes() > 0 && start.getMinutes() < 30 ? 30 : 0;

    start.setHours(minutos == 0 ? start.getHours() + 1 : start.getHours(), minutos, 0); //8 AM
    const end = new Date();
    end.setHours(19, 0, 0); //11 PM
    //end.setHours(23, 0, 0); //11 PM
    var contadorTime = 0;
    while (start <= end) {
      contadorTime++;
      var fechaHoraCalculado = new Date(start);
      this.listHora.push({ id: contadorTime, valor: fechaHoraCalculado });
      start.setMinutes(start.getMinutes() + 30);
    }

    const galleryRef: GalleryRef = this.gallery.ref(this.galleryId);
    this.imageData.forEach(element => {
      galleryRef.addImage({
        src: element.srcUrl,
        thumb: element.previewUrl,
        title: element.title,
      });
    });

    this.cargarSedeLocales();
    this.cargarModalidadLaboral();
    this.cargarMotivoReserva();
    this.items = this.imageData.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));


    this.datosBasicosFormGroup = this.formBuilder.group({
      inmuebleCtrl: ['', Validators.required],
      horaInicioCtrl: [1, Validators.required],
      horaFinCtrl: [1, Validators.required],
      motivoReservaCtrl: ['', Validators.required],
      noVolverPreguntarCtrl: new FormControl(false, [])
    });
  }
  onChkChangeAcepteTerminoCondiciones(ob: boolean) {
    this.disabledbtnSolicitarReserva = ob;
  }
  onChkChange(ob: MatCheckboxChange) {
    this.showIdIconPlacas = !this.showIdIconPlacas;
    this.showPlacaMoto = false;
    this.showPlacaAuto = false;
    this.tieneBicicleta = false;
    this.datosBasicosFormGroup.removeControl('numeroplaca');
  }
  Cancelar() {
    this.router.navigate(['/espacios/bandejareserva'])
  }
  cargarControlesIniciales() {
  }
  incrementarHora(incremento: number) {
    this.selectHoras = incremento;
    if (this.datosBasicosFormGroup.value.horaInicioCtrl === "") {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione Hora de Inicio");
      return;
    }
    var getHoraInicio = this.listHora.find((x: any) => { return x.id == this.datosBasicosFormGroup.value.horaInicioCtrl })
    var horaFinCalculador = new Date(getHoraInicio.valor);
    horaFinCalculador.setMinutes(horaFinCalculador.getMinutes() + incremento);
    var find: any = this.listHora.find((x: any) => { return this.datePipe.transform(x.valor, 'HH:mm') == this.datePipe.transform(horaFinCalculador, 'HH:mm') });
    this.datosBasicosFormGroup.patchValue({ horaFinCtrl: find.id });
  }

  async confirmado() {
  
    if (this.selected === undefined) {
      this.bootstrapNotifyBarService.notifyWarning("Seleccione calendario");
      return;
    }
    if (!this.datosBasicosFormGroup.valid)
      return;
    this.disabledbtnSolicitarReserva = false;
    var HoraInicioSeleccionada: any = this.listHora.find(x => { return x.id == this.datosBasicosFormGroup.value.horaInicioCtrl });
    var HoraFinSeleccionada: any = this.listHora.find(x => { return x.id == this.datosBasicosFormGroup.value.horaFinCtrl });
    var request = {
      id: 0,
      idInmueble: this.datosBasicosFormGroup.value.inmuebleCtrl.id,
      idCliente: this.datosEdi.IdCliente,
      idUsuario: 0,
      fotos: null,
      reservaIniCadena: this.datePipe.transform(this.selected, "yyyy-MM-dd") + " " + this.datePipe.transform(HoraInicioSeleccionada.valor, "HH:mm:ss"),
      reservaFinCadena: this.datePipe.transform(this.selected, "yyyy-MM-dd") + " " + this.datePipe.transform(HoraFinSeleccionada.valor, "HH:mm:ss"),
      tipo: 0,
      estado: 1,
      activo: true,
      placaAuto: this.datosEdi.Flagproveedor == true ? "" : this.showPlacaAuto ? this.datosBasicosFormGroup.value.numeroplaca : "",
      placaMoto: this.datosEdi.Flagproveedor == true ? "" : this.showPlacaMoto ? this.datosBasicosFormGroup.value.numeroplaca : "",
      tieneAuto: this.datosEdi.Flagproveedor == true ? false : this.showPlacaAuto,
      tieneMoto: this.datosEdi.Flagproveedor == true ? false : this.showPlacaMoto,
      tieneBici: this.datosEdi.Flagproveedor == true ? false : this.tieneBicicleta,
      idMotivo: this.datosBasicosFormGroup.value.motivoReservaCtrl,
      idZonal: 10,
      idEdificio: this.datosBasicosFormGroup.value.inmuebleCtrl.idEdificio,
      idNivel: this.datosBasicosFormGroup.value.inmuebleCtrl.idNivel,
      IdUsuario: this.datosEdi.Id,
      flagConformidadVacunas: this.datosBasicosFormGroup.value.noVolverPreguntarCtrl
    }
    var response = await this.espaciosService.postMantenimientoReserva(request);

    if (response.success) {
      this.bootstrapNotifyBarService.notifySuccess(response.message);

      setTimeout(() => {
        this.router.navigate(['/espacios/bandejareserva'])
      }, 3000)
    } else {
      this.disabledbtnSolicitarReserva = true;
      this.bootstrapNotifyBarService.notifyWarning(response.message);
    }
  }
  cargarSedeLocales() {
    this.espaciosService.getObtenerInmuebles().then((respuesta) => {
      this.listInmueble = respuesta;
      /* Buscamos AGCERESMATRIZ dentro de la lista de inmueble */
      var existInmuebleAGCERESMATRIZ = this.listInmueble.find((x: any) => { return x.nombre === 'SEDE HATUN WASI' })
      this.datosBasicosFormGroup.patchValue({ inmuebleCtrl: existInmuebleAGCERESMATRIZ !== null || existInmuebleAGCERESMATRIZ !== undefined ? existInmuebleAGCERESMATRIZ : "" });

      if (existInmuebleAGCERESMATRIZ !== null || existInmuebleAGCERESMATRIZ !== undefined)
        this.ObtenerAforo(this.datosBasicosFormGroup.value.inmuebleCtrl, (this.selected == null || this.selected == undefined ? new Date() : this.selected))


    });
  }
  cargarModalidadLaboral() {
    this.listavaloresService.getListaValores({
      idlista: 701,
      idcliente: ""
    }).then((respuesta) => {

      if (respuesta.TipoResultado == 1) {
        this.listModalidadLaboral = respuesta.ListaEntidadComun;
      }
    });
  }

  cargarMotivoReserva() {
    this.listavaloresService.getListaValores({
      idlista: 700,
      idcliente: ""
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listMotivoReserva = respuesta.ListaEntidadComun;
        this.datosBasicosFormGroup.patchValue({ motivoReservaCtrl: respuesta.ListaEntidadComun[0].Id });
      }
    });
  }
}