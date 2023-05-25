import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from "@core/auth/auth.service";

import { ActivatedRoute } from "@angular/router";
import { ClienteService } from '@shared/services/cliente.service';
import { ClientePorUsuarioDto } from '@core/models/ClienteDto';
import { CookieService } from 'ngx-cookie-service';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [CookieService],
})
export class DashboardComponent implements OnInit {
  // constructor(private navbarTitleService: NavbarTitleService, private notificationService: NotificationService) { }
  // constructor(private navbarTitleService: NavbarTitleService, private notificationService: NotificationService) { }
  listClientePorUsuario: ClientePorUsuarioDto[] = [];
  datosEdi: any = {};
  constructor(
    private cookieService: CookieService,
    private clienteSeleccionado: ClienteService,
    private _authService: AuthService,
    private route: ActivatedRoute
  ) {

    let valor: any = this.route.snapshot.paramMap.get('id');
    if (valor !== '0') {
      const decoded = atob(valor);
      const original = this.fromBinary(decoded);
      this.datosEdi = JSON.parse(original);
      localStorage.clear();
      this._authService.accessEdi = JSON.stringify(this.datosEdi.usuario);
      this._authService.accessToken = this.datosEdi.token;
      
    }
  }



  // constructor(private navbarTitleService: NavbarTitleService) { }

  public ngOnInit() {



  }


  fromBinary(binary: string) {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const charCodes = new Uint16Array(bytes.buffer);
    let result = '';
    for (let i = 0; i < charCodes.length; i++) {
      result += String.fromCharCode(charCodes[i]);
    }
    return result;
  }
}
