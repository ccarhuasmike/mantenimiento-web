import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./core/auth/guards/auth.guard";
import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { ActivosModule } from "@modules/activos/activos.module";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () => import(`./modules/auth/auth.module`).then(m => m.AuthModule),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [    
      {
        path: 'dashboard',
        loadChildren: () => import(`./dashboard/dashboard.module`).then(m => m.DashboardModule),      
      },
      {
        path: 'distribucion',
        loadChildren: () => import(`./modules/distribuciones/distribuciones.module`).then(m => m.DistribucionesModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'solicitud',
        loadChildren: () => import(`./modules/solicitudes/solicitudes.module`).then(m => m.SolicitudesModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'calculadora',
        loadChildren: () => import(`./modules/activos/activos.module`).then(m => m.ActivosModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'espacios',
        loadChildren: () => import(`./modules/espacios/espacios.module`).then(m => m.EspaciosModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'materiales',
        loadChildren: () => import(`./modules/materiales/materiales.module`).then(m => m.MaterialesModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'iot',
        loadChildren: () => import(`./modules/iot/iot.module`).then(m => m.IotModule),
        canActivate: [AuthGuard],
      }
    ]
  },  
  {
    path: 'nodisponible',
    loadChildren: () => import(`./modules/no-disponible/no-disponible.module`).then(m => m.NoDisponibleModule),
    //canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
