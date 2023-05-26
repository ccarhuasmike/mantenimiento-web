import { ElementRef,Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { FormControl,FormGroup,FormBuilder,UntypedFormGroup,Validators } from "@angular/forms";
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
import { DialogoConfigUsuarioEspaciosComponent } from '@shared/components/dialogo-config-usuarioespacios/dialogo-config-usuarioespacios.component';import { ClienteService } from "@shared/services/cliente.service";
import { CookieService } from "ngx-cookie-service";
import { Persona } from "src/app/models/interface/Persona";


import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { DialogoConfirmRegistroespacioComponent } from "../dialogo-confirm-registroespacio/dialogo-confirm-registroespacio.component";


 export interface Inmueble {
  id: number;
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
  templateUrl: 'registroespaciosNew.component.html',
  styleUrls: ['registroespaciosNew.component.css'],

})

export class RegistroespaciosNewComponent implements OnInit {
  selectParqueoVehicular :string;
  selectedLanguage = '';
  selectHoras = 0;

  maxDate = new Date();
  minDate = new Date();
  @ViewChild('personInput') personInput?: ElementRef<HTMLInputElement>;
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
  listPisos: any[] = [];
  listHora: any[] = [];
  listMotivoReserva: any[] = [];
  showIdIconPlacas: boolean = false;
  showParqueoVehicular: boolean = false;
  showSalaReunion: boolean = false;
  showPlacaAuto: boolean = false;
  showPlacaMoto: boolean = false;
  tieneBicicleta: boolean = false;
  disabledbtnSolicitarReserva: boolean = false;
  datosBasicosFormGroup!: UntypedFormGroup;
  disabledHoras: boolean = false;

  personCtrl = new FormControl();
  filteredPersons: Observable<Persona[]>;
  Persons: Persona[] = [];
  allPersons: Persona[] = [];
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  nombreInmueble?:string;
  nombrePiso?:string;
  // primerFormGroup: FormGroup = this._formBuilder.group({primerCtrl: ['']});
  // segundoFormGroup: FormGroup = this._formBuilder.group({segundoCtrl: ['']});
  
  primerFormGroup!: FormGroup;
  segundoFormGroup!: FormGroup;
  terceroFormGroup!: FormGroup;
  cuartoFormGroup!: FormGroup;
  quintoFormGroup!: FormGroup;
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
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    public clienteService: ClienteService,
    private cookieService: CookieService
  ) {
    this.selectParqueoVehicular="No";
    this.maxDate.setDate(this.maxDate.getDate() + 14);
    clienteService.cartEvent$.subscribe((value) => {        
      this.cookieService.delete('objetoClientePorUsuario');
      this.cookieService.set('objetoClientePorUsuario', JSON.stringify(value));
      
    });
    this.filteredPersons = this.personCtrl.valueChanges.pipe(startWith(null), map((prov: string | null) => (prov ? this._filter(prov) : this.allPersons.slice())));    
  }
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
    this.cargarMotivoReserva();
    this.items = this.imageData.map(item => new ImageItem({ src: item.srcUrl, thumb: item.previewUrl }));

//jmatto
    this.datosBasicosFormGroup = this.formBuilder.group({
      inmuebleCtrl: ['', Validators.required],
      horaInicioCtrl: [1, Validators.required],
      horaFinCtrl: [1, Validators.required],
      motivoReservaCtrl: ['', Validators.required],
      noVolverPreguntarCtrl: new FormControl(false, [])
    });

    this.espaciosService.getObtenerPersonas().then((respuesta) => {
      this.allPersons=respuesta;
    });




    this.primerFormGroup = this.formBuilder.group({
      horaInicioCtrl: [1, []],
      horaFinCtrl: [1, []],
      motivoReservaCtrl: ['', Validators.required]
    });
    this.segundoFormGroup = this.formBuilder.group({
        inmuebleCtrl: [0, Validators.required]
        // ,
        // horaInicioCtrl: [1, Validators.required],
        // horaFinCtrl: [1, Validators.required],
        // motivoReservaCtrl: ['', Validators.required],
        // noVolverPreguntarCtrl: new FormControl(false, [])
      });
      this.terceroFormGroup = this._formBuilder.group({terceroCtrl: [''],selectParqueoVehicular:"No"});
      this.cuartoFormGroup  = this._formBuilder.group({cuartoCtrl: [''],personsInvolucrados: [, []],correosCtrl:'sdabhikagathara@rediffmail.com, "assdsdf" <dsfassdfhsdfarkal@gmail.com>, "rodnsdfald ferdfnson" <rfernsdfson@gmal.com>, "Affdmdol Gondfgale" <gyfanamosl@gmail.com>, "truform techno" <pidfpinfg@truformdftechnoproducts.com>, "NiTsdfeSh ThIdfsKaRe" <nthfsskare@ysahoo.in>, "akasdfsh kasdfstla" <akashkatsdfsa@yahsdfsfoo.in>, "Bisdsdfamal Prakaasdsh" <bimsdaalprakash@live.com>,; "milisdfsfnd ansdfasdfnsftwar" <dfdmilifsd.ensfdfcogndfdfatia@gmail.com> datum eternus hello+11@gmail.com'});
      this.quintoFormGroup = this._formBuilder.group({selectSalaReunion:"No"});
  }

  cargarSedeLocales() {
    /* var clienteSeleccion = JSON.parse(this.cookieService.get('objetoClientePorUsuario'));
     this.espaciosService.getObtenerInmuebles(clienteSeleccion.Id).then((respuesta) => {
       this.listInmueble = respuesta;
      
       var existInmuebleAGCERESMATRIZ = null;
       if(clienteSeleccion.Id == 62) // MiBanco
          existInmuebleAGCERESMATRIZ = this.listInmueble.find((x: any) => { return x.nombre === 'SEDE HATUN WASI' })      
       this.datosBasicosFormGroup.patchValue({ inmuebleCtrl: existInmuebleAGCERESMATRIZ !== null && existInmuebleAGCERESMATRIZ !== undefined ? existInmuebleAGCERESMATRIZ : this.listInmueble[0] });
       var inmAGCERESMATRIZ = this.listInmueble.find((x: any) => {return { id: x.id, nombre:x.nombre }})
       this.segundoFormGroup.controls['inmuebleCtrl'].setValue(inmAGCERESMATRIZ !== null && inmAGCERESMATRIZ !== undefined ? inmAGCERESMATRIZ :{ id: this.listInmueble[0].id, nombre:this.listInmueble[0].nombre });
       if (existInmuebleAGCERESMATRIZ !== null && existInmuebleAGCERESMATRIZ !== undefined)
         this.ObtenerAforo(this.datosBasicosFormGroup.value.inmuebleCtrl, (this.selected == null || this.selected == undefined ? new Date() : this.selected))
 
         this.nombreInmueble = (inmAGCERESMATRIZ !== null && inmAGCERESMATRIZ !== undefined ? inmAGCERESMATRIZ :  this.listInmueble[0].nombre, this.listInmueble[0].nombre);
         this.cargarPisos();
     });*/
     var clienteSeleccion = JSON.parse(this.cookieService.get('objetoClientePorUsuario'));
     this.espaciosService.getObtenerInmuebles(clienteSeleccion.Id).then((respuesta) => {
       this.listInmueble = respuesta;
       this.segundoFormGroup.controls['inmuebleCtrl'].setValue(this.listInmueble[0].id);      
       this.cargarPisos();
     });
   }
   cargarPisos(){
     var inmSelect  = this.segundoFormGroup.controls['inmuebleCtrl'].value;
     if(inmSelect!=null){
         this.espaciosService.getObtenerPisos(inmSelect).then((respuesta) => {
           this.listPisos=respuesta;          
         }); 
     }
   }



  add(event: MatChipInputEvent): void {
    const value = this.allPersons.find(p => p.idPersona = parseInt(event.value));
    if (value) {
      this.Persons.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    this.personCtrl.setValue(null);
  }

  remove(per: Persona): void {
    const index = this.Persons.indexOf(per);
    if (index >= 0) this.Persons.splice(index, 1);
  }
  selectedP(event: MatAutocompleteSelectedEvent): void {
    const value = this.allPersons.find(p => p.idPersona == parseInt(event.option.value));
    if (value) this.Persons.push(value);
    if (this.personInput != undefined) this.personInput.nativeElement.value = '';
    this.personCtrl.setValue(null);
  }
  private _filter(value: string): Persona[] {        
    
    if (this.isNumber(value)) {
      var rsp = this.allPersons.filter(p => p.idPersona == parseInt(value));
      if(rsp.length>0)
       return rsp;
      else 
       return this.allPersons.filter(p => p.nroDocumento.includes(value));
    } else {
      const filterValue = value.toLowerCase();
      return this.allPersons.filter(p => p.nombreCompleto.toLowerCase().includes(filterValue) || p.nroDocumento.includes(filterValue));
     }
  }
  private isNumber(value: string | number): boolean {
    return ((value != null) &&
      (value !== '') &&
      !isNaN(Number(value.toString())));
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
    let listHoraOrdenado = listHoraAOrdenar.sort((primer, segundo) => 0 - (primer.id > segundo.id ? 1 : -1));

    this.disabledHoras = value.checked;
    this.datosBasicosFormGroup.patchValue({
      horaFinCtrl: value.checked ? listHoraOrdenado[0].id : 1
    });
  }

  galleryId = 'mixedExample';

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
      placaAuto: this.datosEdi.FlagPersona == true ? "" : this.showPlacaAuto ? this.datosBasicosFormGroup.value.numeroplaca : "",
      placaMoto: this.datosEdi.FlagPersona == true ? "" : this.showPlacaMoto ? this.datosBasicosFormGroup.value.numeroplaca : "",
      tieneAuto: this.datosEdi.FlagPersona == true ? false : this.showPlacaAuto,
      tieneMoto: this.datosEdi.FlagPersona == true ? false : this.showPlacaMoto,
      tieneBici: this.datosEdi.FlagPersona == true ? false : this.tieneBicicleta,
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

  
  cargarMotivoReserva() {
    this.listavaloresService.getListaValores({idlista: 700,idcliente: ""}).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listMotivoReserva = respuesta.ListaEntidadComun;
        //this.datosBasicosFormGroup.patchValue({ motivoReservaCtrl: respuesta.ListaEntidadComun[0].Id });
      }
    });
  }
  radioChangeParqueoVehicular($event: any) {
    if($event.value == "Sí"){
      this.showParqueoVehicular=true;
      this.showPlacaAuto=false;
      this.btnMostrarPlacaAuto();
     }
     else{
      this.showParqueoVehicular=false;
     }
   }


   radioChangeSalaReunion($event: any) {
    this.showSalaReunion=$event.value == "Sí";    
   }
   solicitarReserva(){
    this.dialogo.open(DialogoConfirmRegistroespacioComponent, {
      maxWidth: '40vw',
      maxHeight: '98vh',
      height: '98vh',
      width: '40%',
      disableClose: true,
      data: {
        IdSolicitud: 0,
        titulo: `Confirmación de datos de la reserva`,
        NombreLogin : this.datosEdi.Nombre,
        fecha:"05/05/2023",
        todoEldia:"No",
        hInicio:"14:00",
        hFin:"16:00",
        motivo:"Día regular presencial",
        inmueble:"SEDE TORRE INTERBANK",
        piso:"SEDE SAN BORJA-PISO 1",
        parqueoVehicular:"Sí",
        vehiculo:"AUTO", // MOTO,BICI
        placa:"D4H319",
        visitantes:"Javier Matto Choque",        
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {
        if (confirmado.respuesta) {

          this.bootstrapNotifyBarService.notifySuccess("Se generó correctamente la solicitud de reserva");
          setTimeout(() => {
            this.router.navigate(['/espacios', 'bandejareserva'])
          }, 3000)

          // this.espaciosService.postInsertarConfigUsuariosEspacios(confirmado.request).then((response) => {
          //   if (response.success) {
          //     this.bootstrapNotifyBarService.notifySuccess(response.body.mensaje);
          //   } else {
          //     this.bootstrapNotifyBarService.notifyWarning(response.body.mensaje);
          //   }
          // });

        }
      });
  }
   procesarCorreos(){
    var text = this.cuartoFormGroup.controls['correosCtrl'].value;
    let value =  this.extractEmails(text).join('\n');
  console.log(value);

    this.cuartoFormGroup.patchValue({correosCtrl : value });
          
   }

   extractEmails (text:any)
   {
       return text.match(/([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
   }

}