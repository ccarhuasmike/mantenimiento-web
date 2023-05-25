import { RouterLinkActive, Routes } from '@angular/router';
import { RegistroAlmacenesComponent } from "./pages/registro-almacenes-page/registro-almacenes.component";
import { BandejaAlmacenesComponent } from './pages/bandeja-almacenes-page/bandeja-almacenes.component';
import { AuthGuard } from "@core/auth/guards/auth.guard";
import { RegistroGuiasComponent } from './pages/registroguias-page/registroguias.component';
import {PrintDataComponent} from "@shared/components/print-data/print-data.component";
export const MaterialesRoutingModule: Routes = [
  {
    path: 'bandejaAlmacenes',
    component: BandejaAlmacenesComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Bandeja almacenes',
      }
    }
  },
  {
    path: "registroAlmacen",
    component: RegistroAlmacenesComponent,
    data: {
      breadcrumb: {
        label: 'Registro almacenes',
      }
    }
  },
  {
    path: "registroguias",
    component: RegistroGuiasComponent,
    data: {
      breadcrumb: {
        label: 'Registro Guias',
      }
    }

  },
  {
    path: "print/invoice/:invoiceIds",
    component: PrintDataComponent,
    /*children: [
      { path: 'invoice', component: PrintDataComponent }
    ]*/
  }
];
