import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iotRoutingModule } from './iot-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from "@angular/material/sidenav";


import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { getDutchPaginatorIntl } from "@shared/services/es-paginator-intl";
import { RegistroConfiguracionPageComponent } from "@modules/iot/pages/registro-configuracion-page/registro-configuracion.component";
import { BandejaConfiguracionPageComponent } from "@modules/iot/pages/bandeja-configuracion-page/bandeja-configuracion.component";
import { RouterModule } from "@angular/router";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTreeModule } from '@angular/material/tree';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';


import { ControladorIotPageComponent } from './pages/controlador-iot-page/controlador-iot-page.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    BandejaConfiguracionPageComponent,
    RegistroConfiguracionPageComponent,
    ControladorIotPageComponent,

  ],
  imports: [
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),
MatRadioModule,
    MatListModule,
    MatCardModule,
    BreadcrumbModule,
    MatChipsModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    NgProgressModule,
    NgProgressHttpModule,
    MatCheckboxModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTreeModule,
    MatStepperModule,
    MatDialogModule,
    NgxDropzoneModule,
    MatSnackBarModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule,

    //SolicitudesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    RouterModule.forChild(iotRoutingModule),
    MatTooltipModule,
    SharedModule,
    DragDropModule 
  /*  BrowserModule,
    BrowserAnimationsModule,
*/

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-pe' },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
    MatDatepickerModule,
    DatePipe,

  ],
})
export class IotModule {
}
