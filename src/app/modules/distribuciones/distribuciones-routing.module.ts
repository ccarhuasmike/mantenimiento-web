import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../core/auth/guards/auth.guard";
import { RegistroDistribucionComponent } from "@modules/distribuciones/page/registrodistribucion-page/registrodistribucion.component";
import { MisSolicitudesComponent } from "@modules/distribuciones/page/missolicitudes-page/missolicitudes.component";
import { ActualizacionMasivaComponent } from "@modules/distribuciones/page/actualizacionmasiva-page/actualizacionmasiva.component";
import { ConsultaOrdenesComponent } from "@modules/distribuciones/page/consultaordenes-page/consultaordenes.component";
import { ConsultaSolicitudesComponent } from "@modules/distribuciones/page/consultasolicitudes-page/consultasolicitudes.component";
import { ReportesComponent } from "@modules/distribuciones/page/reportes-page/reportes.component";

export const DistribucionesRoutingModule: Routes = [
  {
    path: '',
    children: [
      {
        path: 'registrardistribucion',
        component: RegistroDistribucionComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: {
            label: 'Registro Distribución',
          }
        }
      }],
  },
  {
    path: 'missolicitudes',
    component: MisSolicitudesComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Mis Solicitudes',
      }
    }
  },
  {
    path: 'actualizacionmasiva',
    component: ActualizacionMasivaComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Actualización masiva',
      }
    }
  },
  {
    path: 'consultaordenes',
    component: ConsultaOrdenesComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Consulta de Órdenes de Entrega',
      }
    }
  },
  {
    path: 'consultasolicitudes',
    component: ConsultaSolicitudesComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Consulta de Solicitudes',
      }
    }
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Reportes',
      }
    }
  }
];
