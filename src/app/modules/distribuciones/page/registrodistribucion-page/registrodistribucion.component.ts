import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AzureService } from "../../../../core/azure/azure.service";
import { map, startWith } from 'rxjs/operators';
import { asEnumerable } from 'linq-es2015';
import { DistribucionesService } from '../../services/distribuciones.service';
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
import { ListavaloresService } from '@shared/services/listavalores.service';






@Component({
  selector: 'app-registrodistribucion-page',
  templateUrl: './registrodistribucion.component.html',
  styleUrls: ['./registrodistribucion.component.css'],
  providers: [ChecklistDatabaseInmueble, ChecklistDatabaseGrupoMantenimiento]
})
export class RegistroDistribucionComponent implements OnInit, OnDestroy {
  matexpansionpaneldatosgenerales: boolean = false;

  progressRef!: NgProgressRef;
  clienteMaster: number = 0;
  value: number = 0;
  mode = new UntypedFormControl('side');
  isLoading = false;
  isSubmitted: boolean = false;

  RegEx_mailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  //RegEx_Telefono = "^[679]{1}[0-9]{8}$";
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEquipoFormGroup!: UntypedFormGroup;

  displayedColumns: string[] =
    [
      'select',
      'Destino',
      'Descripcion',
      'Cantidad',
      'UndMed',
      'Accion'
    ];
  listAgenciaOrigen: any[] = [];
  listTipoServicio: any[] = [];
  listPrioridad: any[] = [];
  listTipoOrigen: any[] = [];
  listTipoPaquete: any[] = [];

  constructor(
    public clienteService: ClienteService,
    public router: Router,
    private ngProgress: NgProgress,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    public dialogo: MatDialog,
    private distribucionesService: DistribucionesService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private listavaloresService: ListavaloresService
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
    var respuesta = await this.listavaloresService.getListaValores({
      idlista: 62,
      idcliente: ""
    });

    if (respuesta.TipoResultado == 1) {
      this.listAgenciaOrigen = respuesta.ListaEntidadComun;
      console.log("idlista: 62");
      console.log(respuesta.ListaEntidadComun);
    }

    var respuesta = await this.listavaloresService.getListaValores({
      idlista: 180,
      idcliente: ""
    });

    if (respuesta.TipoResultado == 1) {
      this.listTipoServicio = respuesta.ListaEntidadComun;
    }

    var respuesta = await this.listavaloresService.getListaValores({
      idlista: 181,
      idcliente: ""
    });

    if (respuesta.TipoResultado == 1) {
      this.listTipoOrigen = respuesta.ListaEntidadComun;
    }

    var respuesta = await this.listavaloresService.getListaValores({
      idlista: 182,
      idcliente: ""
    });

    if (respuesta.TipoResultado == 1) {
      this.listPrioridad = respuesta.ListaEntidadComun;
    }

    var respuesta = await this.listavaloresService.getListaValores({
      idlista: 183,
      idcliente: ""
    });

    if (respuesta.TipoResultado == 1) {
      this.listTipoPaquete = respuesta.ListaEntidadComun;
    }
  }

  FinalizarRegistroSolicitud() {

  }


  //#endregion
}
