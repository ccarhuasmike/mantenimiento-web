import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MdModule} from '../md/md.module';
import {MatDividerModule} from '@angular/material/divider';
//import { MaterialModule } from '../app.module';

import {DashboardComponent} from './dashboard.component';
import {DashboardRoutes} from './dashboard.routing';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from "@angular/material/table";
import {LottieComponent} from "ngx-lottie";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        MdModule,
        MatDividerModule,
        MatTooltipModule,
        MatTableModule,
        LottieComponent,
        NgOptimizedImage,
        // MaterialModule
    ],
  declarations: [DashboardComponent]
})

export class DashboardModule {
}
