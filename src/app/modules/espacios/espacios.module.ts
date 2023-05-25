import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RegistroespaciosComponent } from "@modules/espacios/pages/registroespacios-page/registroespacios.component";
import { BandejaEspaciosComponent } from "@modules/espacios/pages/bandejaespacio-page/bandejaespacio.component";

import { RouterModule } from "@angular/router";
import { EspaciosRoutingModule } from "@modules/espacios/espacios-routing.module";
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
import { getDutchPaginatorIntl } from "@shared/services/es-paginator-intl";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { MatTableModule } from '@angular/material/table';
//import { DialogoImageComponent } from "@shared/components/dialogo-image/dialogo-image.component";
import { MatDialogModule } from '@angular/material/dialog';
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { SnackBarService } from "@shared/services/snack-bar.service";
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { ReporteBIEspaciosComponent } from "./pages/reportebiespacios-page/reportebiespacios.component";
import { RegistroespaciosNewComponent } from "./pages/registroespaciosNew-page/registroespaciosNew.component";
import {MatStepperModule} from '@angular/material/stepper';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    RegistroespaciosComponent,
    RegistroespaciosNewComponent,
    BandejaEspaciosComponent,
    ReporteBIEspaciosComponent,
    RegistroespaciosNewComponent
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
    RouterModule.forChild(EspaciosRoutingModule),
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
    MatStepperModule
  ],  
  bootstrap: [RegistroespaciosNewComponent],
  providers: [
    SnackBarService,
    BootstrapNotifyBarService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-pe' },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
    MatDatepickerModule,
    DatePipe,

    // { provide: SnackBarService, useValue: {} },
    // { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
  ],
})
export class EspaciosModule {

}