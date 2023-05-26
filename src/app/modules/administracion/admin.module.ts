import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from "@angular/material/sidenav";
import { BreadcrumbModule } from "xng-breadcrumb";
import { MatExpansionModule } from "@angular/material/expansion";
import { SharedModule } from "@shared/shared.module";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { SnackBarService } from "@shared/services/snack-bar.service";
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import {MatStepperModule} from '@angular/material/stepper';
import { getDutchPaginatorIntl } from "@shared/services/es-paginator-intl";
import {
  RegistroClienteComponent
} from "@modules/administracion/pages/cliente/registro-cliente-page/registro-cliente.component";
import {
  EditarClienteComponent
} from "@modules/administracion/pages/cliente/editar-cliente-page/editar-cliente.component";
import {
  BandejaClienteComponent
} from "@modules/administracion/pages/cliente/bandeja-cliente-page/bandeja-cliente.component";
import {AdminRoutingModule} from "@modules/administracion/admin-routing.module";
import {
  FormClienteComponent
} from "@modules/administracion/pages/cliente/form-cliente-page/form-cliente-page.component";
import { BandejaPisosPageComponent } from './pages/pisos/bandeja-pisos-page/bandeja-pisos-page.component';
import { EditarPisosPageComponent } from './pages/pisos/editar-pisos-page/editar-pisos-page.component';
import { FormPisosPageComponent } from './pages/pisos/form-pisos-page/form-pisos-page.component';
import { RegistroPisosPageComponent } from './pages/pisos/registro-pisos-page/registro-pisos-page.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    RegistroClienteComponent,
    EditarClienteComponent,
    BandejaClienteComponent,
    FormClienteComponent,
    BandejaPisosPageComponent,
    EditarPisosPageComponent,
    FormPisosPageComponent,
    RegistroPisosPageComponent
  ],
    imports: [
        PowerBIEmbedModule,
        MatTableModule,
        GalleryModule,
        MatCheckboxModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatSelectModule,
        MatFormFieldModule,
        RouterModule.forChild(AdminRoutingModule),
        CommonModule,
        ReactiveFormsModule,
        MatSidenavModule,
        BreadcrumbModule,
        MatExpansionModule,
        SharedModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        FormsModule,
        LightboxModule,
        MatDialogModule,
        MatStepperModule,
        MatProgressSpinnerModule
    ],
  bootstrap: [],
  providers: [
    SnackBarService,
    BootstrapNotifyBarService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-pe' },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
    MatDatepickerModule,
    DatePipe,
  ],
})
export class AdminModule {

}
