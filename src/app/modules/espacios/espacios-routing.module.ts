import {Routes} from '@angular/router';
import {RegistroespaciosComponent} from '../espacios/pages/registroespacios-page/registroespacios.component';
import {BandejaEspaciosComponent} from '../espacios/pages/bandejaespacio-page/bandejaespacio.component';
import { ReporteBIEspaciosComponent } from "./pages/reportebiespacios-page/reportebiespacios.component";
import {AuthGuard} from "@core/auth/guards/auth.guard";
import { RegistroespaciosNewComponent } from './pages/registroespaciosNew-page/registroespaciosNew.component';

export const EspaciosRoutingModule: Routes = [
  {
    path: 'regreserva',
    component: RegistroespaciosComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        alias: 'Registro de Reserva'
      }
    }
  },
  {
    path: 'regreserva2',
    component: RegistroespaciosNewComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        alias: 'Registro de Reserva'
      }
    }
  },


  {
    path: 'bandejareserva',
    component: BandejaEspaciosComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Bandeja Reserva',
      }
    }
  },
  {
    path: 'dashboarreserva',
    component: ReporteBIEspaciosComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Darboard Reservas',
      }
    }
  }
];
