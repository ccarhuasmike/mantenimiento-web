import { Component, OnInit, OnDestroy, ElementRef, OnChanges, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable, of } from 'rxjs';
import { RegistroConfiguracionService } from '../../services/registro-configuracion.services';
import {
  DialogoConfirmacionComponent
} from '../../../../shared/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from "@angular/material/dialog";
import { ClientePorUsuario } from "../../../../core/models/ClienteDto";
import { TipoSolicitud } from "../../../../core/models/SolicitudDto";

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ChecklistDatabaseInmueble } from "../../services/auxt-configuracion.service";
import {
  ChecklistDatabaseGrupoMantenimiento
} from "@modules/solicitudes/services/ChecklistDatabaseGrupoMantenimiento.service";
import { InmuebleFlatNode, InmuebleNode } from "../../../../core/models/inmuebletree.model";
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { ClienteService } from '@shared/services/cliente.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BandejaConfiguracionService } from '@modules/iot/services/bandeja-configuracion.services';




export interface Food {
  value: string;
  viewValue: string;
}

declare var $: any; // Importa jQuery


@Component({
  selector: 'app-registro-configuracion-page',
  templateUrl: './registro-configuracion.component.html',
  styleUrls: ['./registro-configuracion.component.css'],
  providers: [ChecklistDatabaseInmueble, ChecklistDatabaseGrupoMantenimiento]

})
export class RegistroConfiguracionPageComponent implements OnInit, OnDestroy,AfterViewInit  {

  progressRef!: NgProgressRef;
  clienteMaster: any;
  value: number = 0;
  mode = new UntypedFormControl('side');
  isLoading = false;
  isLoadingDispositive = false
  isSubmitted: boolean = false;

  isLinear = false;
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;



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


  datosEdi: any = {};

  myControlCliente = new UntypedFormControl('');
  categoría = new UntypedFormControl('');
  myControlInmueble = new UntypedFormControl('');
  nombre = new UntypedFormControl('');
  auxInmueble: any;

  ControlInmuebleSeleccionado: any;
  NombreInmuebleSeleccionado: any;
  optionsCliente: ClientePorUsuario[] = [];
  filteredOptionsCliente: Observable<ClientePorUsuario[]> = of([]);
  filteredOptionsSolicitante: any;

  listTipoSolicitud: TipoSolicitud[] = [];
  regiones: Food[] = [
    { value: 'SA', viewValue: 'Centro de datos de América Occidental' },
    { value: 'NA', viewValue: 'Centro de datos de América del Este' },
    { value: 'EU', viewValue: 'Centro de datos de Europa Central' },
    { value: 'EU', viewValue: 'Centro de datos de Europa Occidental' },
    { value: 'AS', viewValue: 'Centro de datos Indio' },
    { value: 'AS', viewValue: 'Centro de datos de China' },



  ];

  validateSelect = false;
  todo: any = [

  ];

  doneDispositive: any = [];




  /*private _filterListarClientePorUsuario(name: string): ClientePorUsuario[] {
    const filterValue = name.toLowerCase();
    return this.optionsCliente.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }*/

  displayFnClientePorUsuario(user: ClientePorUsuario): string {

    return user && user.nombre ? user.nombre : '';
  }
  datosBasicosFormGroup!: UntypedFormGroup;
  gdpData: any;
  public dispositivo: any;
  public environment: string = "";
  selectedContinent : string;

  constructor(
    public clienteService: ClienteService,
    public router: Router,
    private ngProgress: NgProgress,
    private _formBuilder: UntypedFormBuilder,
    public dialogo: MatDialog,
    private registroConfiguracionService: RegistroConfiguracionService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private formBuilder: FormBuilder,
    private bandejaConfiguracionService: BandejaConfiguracionService,
  ) {

    this.datosBasicosFormGroup = this._formBuilder.group({
      myControlCliente: this.myControlCliente,
      myControlInmueble: this.myControlInmueble,

    });
    this.detectarCambio(this.clienteMaster)
this.selectedContinent =""
    //this.clienteMaster= this.clienteService.getClienteSeleccionado

    //  this.dispositivo = JSON.parse(this.router.getCurrentNavigation()!.extras.state!["dispositivo"]);
  }






  ngOnDestroy(): void {
    this.ngProgress.destroyAll();
  }
  async ngOnInit() {
    //this.startMap("");
    this.clienteService.cartEvent$.subscribe(value => {
      // Actualiza el valor seleccionado y realiza las acciones necesarias

      this.clienteMaster = value.Id
      this.datosBasicosFormGroup.patchValue({
        myControlCliente: value.Id,
        myControlInmueble: "",

      });
      this.detectarCambio(value.Id)
      // Vuelve a pintar tu select u otras operaciones necesarias
    });

    this.firstFormGroup = this.formBuilder.group({
      localizacion: ['', Validators.required],
      apiKey: ['', Validators.required],
      token: ['', Validators.required],
    });


   


    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.environment = environment.apiImageTuya;


    this.progressRef = this.ngProgress.ref();


    this.loadDatos()





    //await this.getClientesPorUsuario();

    //  var datagetInfoBaseSolicitud = await this.registroConfiguracionService.getInfoBaseSolicitud();



    this.myControlInmueble.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
          this.filteredOptionsSolicitante = [];
          this.isLoading = true;
        }),
        switchMap(value => this.registroConfiguracionService.getArbolInmuebles({
          IdCliente: this.datosBasicosFormGroup.value.myControlCliente,
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
          } else {
            this.showDropDownInmueble = false;
          }
          this.treeControlInmueble.collapseAll();
        }
      });

  }




  closeInmueble(): void {
    this.datosBasicosFormGroup.patchValue({
      myControlInmueble: null
    });
  }
  searchInmueble(): void {
    this.isLoading = true;


    this.registroConfiguracionService.getArbolInmuebles({
      IdCliente: this.datosBasicosFormGroup.value.myControlCliente,
      IdUsuario: this.datosEdi.Id,
      nombre: ""
    }).then((responseInmuble) => {

      if (responseInmuble.TipoResultado) {
        this.dataSourceInmueble.data = responseInmuble.Lista;
        this.isLoading = false
        if (this.dataSourceInmueble.data.length > 0) {
          this.showDropDownInmueble = true;
        } else {
          this.showDropDownInmueble = false;
        }
        this.treeControlInmueble.collapseAll();
      }
    });
  }

  /*async getClientesPorUsuario() {
    var res = await this.registroConfiguracionService.getClientesPorUsuario();
    this.optionsCliente = res;
    this.filteredOptionsCliente = this.myControlCliente.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.NombreCorto)),
      map(nombre => (nombre ? this._filterListarClientePorUsuario(nombre) : this.optionsCliente.slice())),
    );
  }
*/
  async matAutocompleteSeleccionCliente(event: any) {

    this.listTipoSolicitud = [];
    this.dataSourceInmueble.data = [];
    this.datosBasicosFormGroup.patchValue({
      myControlGrupoMantenimiento: null,
      myControlInmueble: null,
      tipoSolicitudCtrl: '',
    });

  }

  onSelectLocalizacion(data: any) {
    this.firstFormGroup.patchValue({
      localizacion: data
    })

  
  let mapObj = $("#map").vectorMap("get", "mapObject");
  mapObj.clearSelectedRegions();
  
  mapObj.setSelectedRegions(data.value);
   //this.startMap(this.firstFormGroup.value.localizacion.value);
  }

  finalizarUbigeo() {

    console.log(this.firstFormGroup.value)

  }
  detectarCambio(value: any) {

    if (value) {


      this.validateSelect = true
      this.datosBasicosFormGroup.controls["myControlInmueble"].enable();
      //  var datosCliente = this.optionsCliente.find(x => x.id === datagetInfoBaseSolicitud.IdCliente);
    } else {
      this.datosBasicosFormGroup.controls["myControlInmueble"].disable();

      this.validateSelect = false

    }
  }


  async FinalizarRegistroSolicitud() {

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

          let data = {
            "idInmueble": this.auxInmueble.IdInmueble || null,
            "idEdificio": this.auxInmueble.IdEdificio || null,
            "idNivel": this.auxInmueble.IdNivel || null,
            "idArea": this.auxInmueble.IdArea || null,
            "idDispositivo": this.dispositivo.id,
            "icon": this.dispositivo.icon,
            "asset_id": this.dispositivo.asset_id,
            "product_id": this.dispositivo.product_id,
            "category": this.dispositivo.category,
            "category_name": this.dispositivo.category_name,
            "gateway_id": this.dispositivo.gateway_id,
            "ip": this.dispositivo.ip,
            "local_key": this.dispositivo.local_key,
            "model": this.dispositivo.model,
            "name": this.dispositivo.name,
            "product_name": this.dispositivo.product_name,
            "sub": this.dispositivo.sub,
            "uuid": this.dispositivo.uuid,
          }

          this.registroConfiguracionService.postGuardarDispositivo(data).then((response) => {
            if (response.code === 200) {
              this.bootstrapNotifyBarService.notifySuccess(response.message);
              setTimeout(() => {
                this.router.navigate(['/iot/bandejaconfiguracion'])
              }, 3000)
            } else {
              this.isSubmitted = false;
              this.bootstrapNotifyBarService.notifyWarning(response.message);
            }

          })


          this.progressRef.complete();
        }
      });
  }

  showDropDownInmueble = false;

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
    let listInmuebleSeleccionado: any = [];
    ancestors.forEach((ancestor: any) => {

      listInmuebleSeleccionado.push(`${ancestor.label}`);
    });
    this.NombreInmuebleSeleccionado = listInmuebleSeleccionado.join(" / ");
    this.ControlInmuebleSeleccionado = node;
    this.datosBasicosFormGroup.patchValue({
      myControlInmueble: this.NombreInmuebleSeleccionado,
    });
    this.auxInmueble = ancestors[ancestors.length - 1]
    this.showDropDownInmueble = false;
  }


  auxFunction(value: string): Object {
    switch (value) {

      case 'SA':
        return {
          'SA': "#003c9a",


        }
      case 'NA':
        return {
          'NA': "#003c9a",

        }
      case 'EU':
        return {
          'EU': "#003c9a",


        }
      case 'AS':
        return {

          'AS': "#003c9a",


        }
    }
    return {};
  }
  ngAfterViewInit() {
    this.startMap("");
  }

  startMap(value: string | "") {
    const self = this;
    $('#map').vectorMap({
      map: 'continents_merc',
      
      backgroundColor: '#ffffff',
      series: {
        regions: [
          {
            values: this.auxFunction(value),
            attribute: 'fill',
          },
        ],
      },

      regionStyle: {
        initial: {
          fill: '#000000',
        },
        selected: {
          fill: "green"
        }
  

      },
   
      onRegionClick: function (event: any, code: any) {
        let value = self.regiones.find((e) => e.value === code);
        self.firstFormGroup.patchValue({
          localizacion: value,
        });
        var mapObj = $("#map").vectorMap("get", "mapObject");
        mapObj.clearSelectedRegions();
      },
    
      regionsSelectable: true
    })
      
  }



  loadDatos(): void {
    this.isLoadingDispositive = true;
    this.doneDispositive = [];


    this.bandejaConfiguracionService.ListarDevices().subscribe(
      {
        next: (res) => {
          this.doneDispositive = res.filter((e: any) => e.agregado === false)
          this.isLoadingDispositive = false;
        },

        error: (err) => {
          this.isLoadingDispositive = false;
          return reject(err)
        },
      }
    )
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }



}
function reject(err: any): void {
  throw new Error('Function not implemented.');
}

