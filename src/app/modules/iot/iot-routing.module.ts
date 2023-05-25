
import {  Routes } from '@angular/router';
import { BandejaConfiguracionPageComponent } from '@modules/iot/pages/bandeja-configuracion-page/bandeja-configuracion.component';
import { RegistroConfiguracionPageComponent } from "@modules/iot/pages/registro-configuracion-page/registro-configuracion.component";
import { AuthGuard } from "../../core/auth/guards/auth.guard";
import { ControladorIotPageComponent } from './pages/controlador-iot-page/controlador-iot-page.component';
import { DispositiveBodyComponent } from '@shared/components/dispositive-body/dispositive-body.component';


export const iotRoutingModule: Routes = [

  {
    path: '',
    children: [
      {
        path: 'bandejaconfiguracion',
        component: BandejaConfiguracionPageComponent,
        data: {
          breadcrumb: {
            label: 'Bandeja de dispositivos',
          }
        },
      }],   
  },
  
  {
    path: 'regconfiguracion',
    component: RegistroConfiguracionPageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Registro de dispositivos',
      }
    }
  },
  {
    path: 'controlIot',
    
    component: ControladorIotPageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Control de dispositivo',
      }
    },
 
  }
];



