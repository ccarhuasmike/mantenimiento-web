import {Routes} from '@angular/router';
import {RegistroClienteComponent} from '../administracion/pages/cliente/registro-cliente-page/registro-cliente.component';
import {BandejaClienteComponent} from '../administracion/pages/cliente/bandeja-cliente-page/bandeja-cliente.component';
import {AuthGuard} from "@core/auth/guards/auth.guard";
import {
  EditarClienteComponent
} from "@modules/administracion/pages/cliente/editar-cliente-page/editar-cliente.component";
import { RegistroPisosPageComponent } from './pages/pisos/registro-pisos-page/registro-pisos-page.component';
import { EditarPisosPageComponent } from './pages/pisos/editar-pisos-page/editar-pisos-page.component';
import { BandejaPisosPageComponent } from './pages/pisos/bandeja-pisos-page/bandeja-pisos-page.component';

export const AdminRoutingModule: Routes = [
  {
    path: 'regcliente',
    component: RegistroClienteComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        alias: 'Registro de Cliente'
      }
    }
  },
  {
    path: 'bandcliente',
    component: BandejaClienteComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Bandeja Cliente',
      }
    }
  },
  {
    path: 'editcliente/:id/:nombreArchivoLogo',
    component: EditarClienteComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        alias: 'Editar de Cliente'
      }
    }
  },



  {
    path: 'regpiso',
    component: RegistroPisosPageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        alias: 'Registro Piso'
      }
    }
  },
  {
    path: 'bandpiso',
    component: BandejaPisosPageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Bandeja Piso',
      }
    }
  },
  {
    path: 'editpiso/:id',
    component: EditarPisosPageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        alias: 'Editar Piso'
      }
    }
  },
];
