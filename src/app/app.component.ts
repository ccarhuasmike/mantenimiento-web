import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from '@shared/services/sidenav.service';
import { UsuarioService } from '@shared/services/usuario.service';
import { onMainContentChange } from './animations/animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [onMainContentChange]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'edi-web!';
  isHandset$: any;
  public onSideNavChange: boolean = false;
  constructor(
    private _sidenavService: SidenavService,
    private _usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {
    this._sidenavService.sideNavState$.subscribe(res => {
      this.onSideNavChange = res;
    })
  }
  ngOnDestroy(): void {

  }
  ngOnInit() {
  }  
}
