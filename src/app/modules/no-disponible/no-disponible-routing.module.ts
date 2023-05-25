import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoDisponiblePageComponent } from './page/no-disponible-page.component';

const routes: Routes = [
  {
    path: '',
    component: NoDisponiblePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoDisponibleRoutingModule { }
