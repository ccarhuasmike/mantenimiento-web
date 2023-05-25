import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroSTusuarioPageComponent } from './page/registrostusuario-page/registrostusuario-page.component';
import { BandejaSolicitudComponent } from "@modules/solicitudes/page/bandejasolicitud-page/bandejasolicitud.component";
import { AuthGuard } from "../../core/auth/guards/auth.guard";
import { BandejaPruebaComponent } from "@modules/solicitudes/page/bandejaprueba-page/bandejaprueba.component";
import { ReporteBIComponent } from "@modules/solicitudes/page/reportebi-page/reportebi.component";
import { EditarSolicitudComponent } from "@modules/solicitudes/page/editarsolicitud/editarsolicitud.component";

export const SolicitudesRoutingModule: Routes = [
  // {
  //   path: '',
  //   component: RegistroSTusuarioPageComponent,
  //   canActivate: [AuthGuard],
  //   data: {
  //     breadcrumb: {
  //       label: 'Registro Solicitud',
  //     }
  //   }
  // },
  {
    path: '',
    //canActivate: [AuthGuard],
    children: [
      {
        path: 'registrosolicitud',
        component: RegistroSTusuarioPageComponent,
        data: {
          breadcrumb: {
            label: 'Registro Solicitud',
          }
        }
      }],   
  },
  {
    path: 'bandejasolicitud',
    component: BandejaSolicitudComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Bandeja Solicitud',
      }
    }
  },
  {
    path: 'bandejasolicitudprueba',
    component: BandejaPruebaComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        alias: 'mentorName'
      }
    }
  },
  {
    path: 'editarsolicitud/:id',
    component: EditarSolicitudComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Editar  Solicitud',
      }
    }
  },
  {
    path: 'reportebi',
    component: ReporteBIComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        alias: 'mentorName'
      }
    }
  }
];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule]
// })
// export class SolicitudesRoutingModule {
// }
