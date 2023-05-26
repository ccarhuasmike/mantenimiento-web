import {Routes} from '@angular/router';
import {RegistroespaciosComponent} from '../espacios/pages/registroespacios-page/registroespacios.component';
import {BandejaEspaciosComponent} from '../espacios/pages/bandejaespacio-page/bandejaespacio.component';
import { ReporteBIEspaciosComponent } from "./pages/reportebiespacios-page/reportebiespacios.component";
import {AuthGuard} from "@core/auth/guards/auth.guard";
import { RegistroespaciosNewComponent } from './pages/registroespaciosNew-page/registroespaciosNew.component';
import { BandejaSalaReunionPageComponent } from './SalaReunion/bandeja-sala-reunion-page/bandeja-sala-reunion-page.component';
import { RegistroSalaReunionPageComponent } from './SalaReunion/registro-sala-reunion-page/registro-sala-reunion-page.component';
import { EditarSalaReunionPageComponent } from './SalaReunion/editar-sala-reunion-page/editar-sala-reunion-page.component';

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
  ,{
    path: 'bandejasala',
    component: BandejaSalaReunionPageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Bandeja Sala Reunión',
      }
    }
  },
  {
    path: 'registrarsala',
    component: RegistroSalaReunionPageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Registrar Sala Reunión',
      }
    }
  },
  {
    path: 'editarsala/:id',
    component: EditarSalaReunionPageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Editar Sala Reunión',
      }
    }
  },

];
