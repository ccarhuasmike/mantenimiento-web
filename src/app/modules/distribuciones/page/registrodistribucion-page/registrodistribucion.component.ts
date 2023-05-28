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

import { NgProgress, NgProgressRef } from '@ngx-progressbar/core';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import {
  DialogAprobadoresComponent
} from "@shared/components/modal-busqueda-aprobadores/modal-busqueda-aprobadores.component";
import {DialogoCargaMasivaDistribucionComponent} from "@shared/components/dialogo-cargamasivadistribucion/dialogo-cargamasivadistribucion.component";
import { ClienteService } from '@shared/services/cliente.service';






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
  constructor(
    public clienteService: ClienteService,
    public router: Router,
    private ngProgress: NgProgress,    
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,    
    public dialogo: MatDialog,
    private distribucionesService: DistribucionesService,    
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    
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

  btnCargaMasivaDistribucion(){
    this.dialogo.open(DialogoCargaMasivaDistribucionComponent, {
      maxWidth: '50vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '50%',
      disableClose: true,
      data: {
        titulo: `Carga Masiva Distribución`,
        //listAprobadores: dataObtenerAprobadores.ListAprobadores
        /*clientChekeado : this.clientSeleccionado.map(x=>{ return x.Id}),
        IdsCliente:this.value==""? []:this.value*/
      }
      //data: this.clientSeleccionado.map(x=>{ return x.Id})
    })
      .afterClosed()
      .subscribe(async (confirmado: any) => {

        // if (confirmado.respuesta) {
        //   this.datosBasicosFormGroup.patchValue({
        //     aprobadoresSolicitudCtrl: confirmado.aprobadoresSeleccionado.length === 0 ? [] : confirmado.aprobadoresSeleccionado.map((x: any) => { return x.Id })
        //   });
        // }
      });
  }
  ngOnDestroy(): void {
    this.ngProgress.destroyAll();
  }

  async ngOnInit() {

  
  }

 
  FinalizarRegistroSolicitud(){

  }


  //#endregion
}
