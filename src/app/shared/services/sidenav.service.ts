import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'


@Injectable()
export class SidenavService {

  // Con este tema puede guardar el estado sidenav y consumirlo más tarde en otras páginas.
  public sideNavState$: Subject<boolean> = new Subject();

  constructor() { }

}
