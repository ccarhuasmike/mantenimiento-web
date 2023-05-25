import {Routes} from '@angular/router';
import {ConfiabilidadComponent} from '../activos/pages/calculadora-confiabilidad/confiabilidad.component';
import {AuthGuard} from "@core/auth/guards/auth.guard";

export const ActivosRoutingModule: Routes = [
  {
    path: 'confiabilidad',
    component: ConfiabilidadComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        alias: 'Calculadora de Confiabilidad'
      }
    }
  }
];
