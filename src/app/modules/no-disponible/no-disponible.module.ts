import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoDisponibleRoutingModule } from './no-disponible-routing.module';
import { NoDisponiblePageComponent } from './page/no-disponible-page.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    NoDisponiblePageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NoDisponibleRoutingModule,
    FormsModule
  ]
})
export class NoDisponibleModule { }
