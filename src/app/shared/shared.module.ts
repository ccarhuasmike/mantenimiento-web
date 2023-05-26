import { RouterModule } from '@angular/router';
import { NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DialogoConfirmacionComponent } from './components/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

import { DropzoneDirective } from './directives/DropzoneDirective';
import { UpperCaseInputDirective } from './directives/Touppercase.Directive';
import { SnackBarService } from '../shared/services/snack-bar.service';
import { ButtonClienteComponent } from '@shared/components/button-cliente/button-cliente';
import { ButtonResponsableComponent } from '@shared/components/button-responsable/button-responsable';
import { ButtonUbigeoComponent } from '@shared/components/button-ubigeo/button-ubigeo';
import { ModalBusquedadUbigeoComponent } from "@shared/components/button-ubigeo/modal-busquedad-ubigeo/modal-busqueda-ubigeo";
import { MatTreeModule } from '@angular/material/tree';
import { MaterialTreeDemoComponent } from "@shared/components/tree-autocomplete/tree-autocomplete.component";
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';


import {
  BusquedaClienteComponent
} from "@shared/components/multiselectcliente/modal-busqueda-cliente/modal-busqueda-cliente.component";


import { MultiSelectClienteComponent } from "@shared/components/multiselectcliente/multiselectcliente.component";

import {
  BusquedaInmuebleComponent
} from "@shared/components/multiselectinmueble/modal-busqueda-inmueble/modal-busqueda-inmueble.component";
import { MultiSelectInmuebleComponent } from "@shared/components/multiselectinmueble/multiselectinmueble.component";


import {
  BusquedaGrupoUnidadComponent
} from "@shared/components/multiselectgrupounidad/modal-busqueda-grupounidad/modal-busqueda-grupounidad.component";
import {
  MultiSelectGrupoUnidadComponent
} from "@shared/components/multiselectgrupounidad/multiselectgrupounidad.component";

import {
  BusquedaSolicitanteComponent
} from "@shared/components/multiselectsolicitante/modal-busqueda-solicitante/modal-busqueda-solicitante.component";
import {
  MultiSelectSolicitanteComponent
} from "@shared/components/multiselectsolicitante/multiselectsolicitante.component";

import {
  BusquedaProveedorComponent
} from "@shared/components/multiselectproveedor/modal-busqueda-proveedor/modal-busqueda-proveedor.component";
import { MultiSelectProveeedorComponent } from "@shared/components/multiselectproveedor/multiselectproveedor.component";

import {
  BusquedaInspectorComponent
} from "@shared/components/multiselectinspector/modal-busqueda-inspector/modal-busqueda-inspector.component";
import { MultiSelectInspectorComponent } from "@shared/components/multiselectinspector/multiselectinspector.component";

import {
  BusquedaTipoSolicitudComponent
} from "@shared/components/multiselecttiposolicitud/modal-busqueda-tiposolicitud/modal-busqueda-tiposolicitud.component";
import {
  MultiSelectTipoSolicitudComponent
} from "@shared/components/multiselecttiposolicitud/multiselecttiposolicitud.component";

import {
  BusquedaEstadoSolComponent
} from "@shared/components/multiselectestadosol/modal-busqueda-estadosol/modal-busqueda-estadosol.component";
import { ModalBusquedadCliente } from "@shared/components/button-cliente/modal-busquedad-cliente/modal-busquedad-cliente";

import { MultiSelectEstadoSolComponent } from "@shared/components/multiselectestadosol/multiselectestadosol.component";
import {
  BusquedaZonalComponent
} from "@shared/components/multiselectzonal/modal-busqueda-zonal/modal-busqueda-zonal.component";
import { MultiSelectZonalComponent } from "@shared/components/multiselectzonal/multiselectzonal.component";

import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';

import {
  DialogoRechazarSolicutdComponent
} from "@shared/components/dialogo-rechazarsolicitud/dialogo-rechazarsolicitud.component";
import {
  DialogoAnularSolicitudComponent
} from "@shared/components/dialogo-anularsolicitud/dialogo-anularsolicitud.component";
import {
  DialogoCambiarTipoSolicitudComponent
} from "@shared/components/dialogo-cambiartiposolicitud/dialogo-cambiartiposolicitud.component";


import {
  DialogoRestaurarSolicitudComponent
} from "@shared/components/dialogo-restaurarsolicitud/dialogo-restaurarsolicitud.component";


import { DialogoLogAccionComponent } from "@shared/components/dialogo-logaccion/dialogo-logaccion.component";
import { DialogoVerTiempoComponent } from "@shared/components/dialogo-vertiempo/dialogo-vertiempo.component";

import { MultiSelectTecnicoComponent } from "@shared/components/multiselecttecnico/multiselecttecnico.component";
import { DialogoRegFechaComponent } from "@shared/components/dialogo-regfecha/dialogo-regfecha.component";
import { BusquedaTecnicoComponent } from "@shared/components/multiselecttecnico/modal-busqueda-tenico/modal-busqueda-tecnico.component";
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { DialogoAdjuntoCloudComponent } from "@shared/components/dialogo-adjuntocloud/dialogo-adjuntocloud.component";
import { SidenavService } from './services/sidenav.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import {
  AutoCompleteGrupoUnidadComponent
} from "@shared/components/autocomplete-grupounidad/autocomplete-grupounidad.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import {
  DialogoEnviarProveedorSolicutdComponent
} from "@shared/components/dialogo-enviarproveedor-solicitud/dialogo-enviarproveedor-solicitud.component";
import {
  DialogAprobadoresComponent
} from "@shared/components/modal-busqueda-aprobadores/modal-busqueda-aprobadores.component";
import {
  DialogoSolicitarPresupuestosComponent
} from "@shared/components/dialogo-solicitarpresupuesto/dialogo-solicitarpresupuesto.component";
import { DialogoReporteTecnicoComponent } from '@shared/components/dialogo-reportetecnico/dialogo-reportetecnico.component';
import { DialogoParadaRelojComponent } from "@shared/components/dialogo-paradareloj/dialogo-paradareloj.component";
import { NgxDropzoneModule } from "ngx-dropzone";
import { DialogoEncuestaComponent } from "@shared/components/dialogo-encuesta/dialogo-encuesta.component";
import { MatSliderModule } from '@angular/material/slider';
import { DialogoTarifarioServicioComponent } from '@shared/components/dialogo-tarifarioservicio/dialogo-tarifarioservicio.component';
import { DialogoTarifarioMaterialesComponent } from '@shared/components/dialogo-tarifariomateriales/dialogo-tarifariomateriales.component';
import { DialogoCountdownComponent } from '@shared/components/dialogo-countdown/dialogo-countdown.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DialogoTiempoatencionComponent } from '@shared/components/dialogo-tiempoatencion/dialogo-tiempoatencion.component';
import { DialogoTarifarioDeMaterialesComponent } from '@shared/components/dialogo-tarifariodelmateriales/dialogo-tarifariodelmateriales.component';
import { DialogoTarifarioDelServicioComponent } from '@shared/components/dialogo-tarifariodelservicio/dialogo-tarifariodelservicio.component';
import { ProgressComponent } from '@shared/components/progress/progress.component';
import { DialogoServicioPrecarioComponent } from '@shared/components/dialogo-servicioprecario/dialogo-servicioprecario.component';
import { DialogoConfigUsuarioEspaciosComponent } from '@shared/components/dialogo-config-usuarioespacios/dialogo-config-usuarioespacios.component';
import { ModalBusquedadResponsable } from '@shared/components/button-responsable/modal-busqueda-responsable/modal-busquedad-responsable';
import { DialogoPreviewQRComponent } from '@shared/components/dialogo-previewqr/dialogo-previewqr.component';
import { QRCodeModule } from 'angularx-qrcode';
import {PrintDataComponent} from "@shared/components/print-data/print-data.component";
import { DialogoDispositivoComponent } from './components/dialogo-dispositivo/dialogo-dispositivo.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DispositiveBodyComponent } from './components/dispositive-body/dispositive-body.component';
import { ComponentsModule } from '../components/components.module';
import { DispositiveControledComponent } from './components/dispositive-controled/dispositive-controled.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DiaglogoCargaMasivaComponent } from './components/diaglogo-carga-masiva/diaglogo-carga-masiva.component';


@NgModule({
  
  declarations: [
    //MultipleSelectionSelectAllExampleComponent,
    DialogoPreviewQRComponent,
    DialogoConfigUsuarioEspaciosComponent,
    DialogoServicioPrecarioComponent,
    ProgressComponent,
    DialogoTarifarioDeMaterialesComponent,
    DialogoTarifarioDelServicioComponent,
    DialogoTiempoatencionComponent,
    DialogoCountdownComponent,
    DialogoTarifarioMaterialesComponent,
    DialogoTarifarioServicioComponent,
    DialogoEncuestaComponent,
    DialogoParadaRelojComponent,
    DialogoReporteTecnicoComponent,
    DialogoSolicitarPresupuestosComponent,
    DialogAprobadoresComponent,
    DialogoEnviarProveedorSolicutdComponent,
    DialogoAdjuntoCloudComponent,
    DialogoRegFechaComponent,
    DialogoVerTiempoComponent,
    DialogoLogAccionComponent,
    MultiSelectZonalComponent,
    BusquedaZonalComponent,
    DialogoRechazarSolicutdComponent,
    DialogoAnularSolicitudComponent,
    DialogoCambiarTipoSolicitudComponent,
    DialogoRestaurarSolicitudComponent,
    MultiSelectEstadoSolComponent,
    BusquedaEstadoSolComponent,
    MultiSelectTipoSolicitudComponent,
    BusquedaTipoSolicitudComponent,
    AutoCompleteGrupoUnidadComponent,
    BusquedaTecnicoComponent,
    MultiSelectTecnicoComponent,
    MultiSelectInspectorComponent,
    BusquedaInspectorComponent,
    MultiSelectProveeedorComponent,
    BusquedaProveedorComponent,
    MultiSelectSolicitanteComponent,
    BusquedaSolicitanteComponent,
    MultiSelectGrupoUnidadComponent,
    BusquedaGrupoUnidadComponent,
    MultiSelectClienteComponent,
    BusquedaClienteComponent,
    ModalBusquedadCliente,
    MultiSelectInmuebleComponent,
    BusquedaInmuebleComponent,
    MaterialTreeDemoComponent,
    DropzoneDirective,
    UpperCaseInputDirective,
    DialogoConfirmacionComponent,
    ButtonClienteComponent,
    ModalBusquedadResponsable,
    ButtonResponsableComponent,
    ButtonUbigeoComponent,
    ModalBusquedadUbigeoComponent,
    PrintDataComponent,
    DialogoDispositivoComponent,
    DispositiveBodyComponent,
    DispositiveControledComponent,
    DiaglogoCargaMasivaComponent,


  ],

  imports: [
    MatFormFieldModule,    
    QRCodeModule,
    MatSliderModule,
    //NgxStarRatingModule,
    MatSelectModule,
    MatListModule,
    MatSidenavModule,
    MatMenuModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTableModule,
    MatGridListModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatTreeModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    NgxDropzoneModule,
    MatSlideToggleModule,
    NgCircleProgressModule.forRoot({
      maxPercent: 100

    }),
    MatTabsModule,
    ComponentsModule,
   
  ],
  exports: [
    DialogoPreviewQRComponent,
    DialogoConfigUsuarioEspaciosComponent,
    DialogoServicioPrecarioComponent,
    ProgressComponent,
    DialogoTarifarioDeMaterialesComponent,
    DialogoTarifarioDelServicioComponent,
    DialogoTiempoatencionComponent,
    DialogoCountdownComponent,
    DialogoTarifarioMaterialesComponent,
    DialogoTarifarioServicioComponent,
    DialogoEncuestaComponent,
    DialogoParadaRelojComponent,
    DialogoReporteTecnicoComponent,
    DialogoSolicitarPresupuestosComponent,
    DialogAprobadoresComponent,
    DialogoEnviarProveedorSolicutdComponent,
    AutoCompleteGrupoUnidadComponent,
    DialogoAdjuntoCloudComponent,
    DialogoRegFechaComponent,
    DialogoVerTiempoComponent,
    DialogoLogAccionComponent,
    DialogoRechazarSolicutdComponent,
    DialogoAnularSolicitudComponent,
    DialogoCambiarTipoSolicitudComponent,
    DialogoRestaurarSolicitudComponent,
    MultiSelectZonalComponent,
    BusquedaZonalComponent,
    BusquedaTecnicoComponent,
    MultiSelectTecnicoComponent,
    MultiSelectEstadoSolComponent,
    BusquedaEstadoSolComponent,
    MultiSelectTipoSolicitudComponent,
    BusquedaTipoSolicitudComponent,
    MultiSelectInspectorComponent,
    BusquedaInspectorComponent,
    MultiSelectProveeedorComponent,
    BusquedaProveedorComponent,
    MultiSelectSolicitanteComponent,
    BusquedaSolicitanteComponent,
    MultiSelectGrupoUnidadComponent,
    BusquedaGrupoUnidadComponent,
    MultiSelectInmuebleComponent,
    BusquedaInmuebleComponent,
    MultiSelectClienteComponent,
    BusquedaClienteComponent,
    ModalBusquedadCliente,
    DropzoneDirective,
    UpperCaseInputDirective,
    DialogoConfirmacionComponent,
    MaterialTreeDemoComponent,
    ButtonClienteComponent,
    ModalBusquedadResponsable,
    ButtonResponsableComponent,
    ButtonUbigeoComponent,
    ModalBusquedadUbigeoComponent,
    PrintDataComponent,
    DialogoDispositivoComponent

  ],
  providers: [
    SidenavService,
    SnackBarService,
    BootstrapNotifyBarService,
    
    // { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
  ],
})
export class SharedModule {
}
