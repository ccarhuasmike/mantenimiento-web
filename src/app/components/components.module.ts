import { NgModule } from '@angular/core';
//import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
/**
// import { MaterialModule } from '../app.module';

import { ButtonsComponent } from './buttons/buttons.component';
import { ComponentsRoutes } from './components.routing';
import { GridSystemComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PanelsComponent } from './panels/panels.component';
import { SweetAlertComponent } from './sweetalert/sweetalert.component';
import { TypographyComponent } from './typography/typography.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {  MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from "@angular/material/datepicker";

import { MatNativeDateModule } from '@angular/material/core';*/
import { SwitchDispositiveComponent } from './switch-dispositive/switch-dispositive.component';

import { PowerDispositiveComponent } from './power-dispositive/power-dispositive.component';
import { BtnDispositiveIncreaseComponent } from './btn-dispositive-increase/btn-dispositive-increase.component';
import { BtnDispositiveDecreaseComponent } from './btn-dispositive-decrease/btn-dispositive-decrease.component';
@NgModule({
  imports: [
  //  MatInputModule,
    CommonModule,
  //  RouterModule.forChild(ComponentsRoutes),
   FormsModule,
 //   MatFormFieldModule,
   // MatDatepickerModule,
  //  MatNativeDateModule
    //MaterialModule
  ],
  providers: [
 //   MatDatepickerModule,
 //   MatNativeDateModule
  ],
  declarations: [
 //     ButtonsComponent,
//GridSystemComponent,
  //    IconsComponent,
   //   NotificationsComponent,
   //   PanelsComponent,
 //     SweetAlertComponent,
  //    TypographyComponent,
      SwitchDispositiveComponent,

      PowerDispositiveComponent,
        BtnDispositiveIncreaseComponent,
        BtnDispositiveDecreaseComponent,

  ],
  exports: [
    SwitchDispositiveComponent,
    PowerDispositiveComponent,
    BtnDispositiveIncreaseComponent,
    BtnDispositiveDecreaseComponent,
  ]
})

export class ComponentsModule {}
