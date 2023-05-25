import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {ConfiabilidadComponent} from "@modules/activos/pages/calculadora-confiabilidad/confiabilidad.component";
import {RouterModule} from "@angular/router";
import {ActivosRoutingModule} from "@modules/activos/activos-routing.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSidenavModule} from "@angular/material/sidenav";
import {BreadcrumbModule} from "xng-breadcrumb";
import {MatExpansionModule} from "@angular/material/expansion";
import {SharedModule} from "@shared/shared.module";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NgChartsModule} from "ng2-charts";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    ConfiabilidadComponent
  ],
    imports: [
        RouterModule.forChild(ActivosRoutingModule),
        CommonModule,
        ReactiveFormsModule,
        MatSidenavModule,
        BreadcrumbModule,
        MatExpansionModule,
        SharedModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        NgChartsModule,
        MatTooltipModule,
        FormsModule,
    ]
})
export class ActivosModule {

}
