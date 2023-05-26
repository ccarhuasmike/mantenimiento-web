
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { ClientePorUsuarioDto } from '@core/models/ClienteDto';
import { ClienteService } from '@shared/services/cliente.service';
import { UsuarioService } from '@shared/services/usuario.service';
import { CookieService } from 'ngx-cookie-service';
import PerfectScrollbar from 'perfect-scrollbar';
import {AzureService} from "@core/azure/azure.service";
// import $ from "jquery";
// declare const $: any;
var $ = require("jquery");

//Metadata
export interface RouteInfo {
  id?: Number;
  path: string;
  title?: string;
  type?: string;
  icontype?: string;
  collapse?: string;
  ab?: string;
  children?: RouteInfo[];
  listAcciones?: [];
}


@Component({
  selector: 'app-sidebar-cmp',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})

export class SidebarComponent implements OnInit {
  public menuItems: any = [];
  ROUTES: RouteInfo[] = [];
  datosEdi: any = {};
  srcLogo?: string = "/assets/img/logo-upgrade-white.png";
  contentLoaded: boolean = false;
  objetoClientePorUsuario: any;
  listClientePorUsuario: ClientePorUsuarioDto[] = [];

  constructor(
    private router: Router,
    private _authService: AuthService,
    private _usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private clienteSeleccionado: ClienteService,
    private cookieService: CookieService,
    private azureService: AzureService,
  ) {

  }

  toBinary(string: string): any {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i);
    }
    const charCodes = new Uint8Array(codeUnits.buffer);
    let result = '';
    for (let i = 0; i < charCodes.byteLength; i++) {
      result += String.fromCharCode(charCodes[i]);
    }
    return result;
  }

  Encryptar(cadena: string): string {
    const converted = this.toBinary(cadena);
    const encoded = btoa(converted);
    return encoded;
  }

  redirectExterno(urlRedirect: string) {
    var request = {
      usuario: JSON.parse(this._authService.accessEdi),
      token: this._authService.accessToken
    };
    var url = urlRedirect + this.Encryptar(JSON.stringify(request));
    window.open(url, "_blank");
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  logout() {

    this._authService.signOut();
    setTimeout(() => {
      this.router.navigateByUrl("/");
    }, 1000);
    //window.location.reload();
  }

  async ngOnInit() {
    this.datosEdi = JSON.parse(this._authService.accessEdi);

    setTimeout(async () => {


      var listOpciones = localStorage.getItem('listOpciones') === null || localStorage.getItem('listOpciones') === undefined ? "" : localStorage.getItem('listOpciones') as string;
      
      if (listOpciones.length > 0) {
        this.datosEdi = JSON.parse(this._authService.accessEdi);
        this.ROUTES = JSON.parse(listOpciones);
        this.menuItems = this.ROUTES.filter(menuItem => menuItem);
        this.contentLoaded = true;

      } else {
        var res = await this._usuarioService.getOpcionPorUsuario();
        localStorage.setItem('listOpciones', JSON.stringify(res.filter((x: any) => {
          return x.movil === false
        })));
        this.ROUTES = JSON.parse(localStorage.getItem('listOpciones') as string);
        this.menuItems = this.ROUTES.filter(menuItem => menuItem);
        this.datosEdi = JSON.parse(this._authService.accessEdi);

        this.contentLoaded = true;
      }
    }, 1000)
    
    this.objetoClientePorUsuario = this.listClientePorUsuario.find(x => { return x.Id == this.datosEdi.IdCliente });
    this.cookieService.set('objetoClientePorUsuario', JSON.stringify(this.objetoClientePorUsuario));
    


    var resgetClientesPorUsuarioFiltro = await this.clienteService.getClientesPorUsuarioFiltro("");
    this.listClientePorUsuario = resgetClientesPorUsuarioFiltro.map((x: any) => {
      return {
        Id: x.Id,
        NumeroDocumento: x.NumeroDocumento,
        Nombre: x.Nombre,
        NombreCorto: x.NombreCorto,
        ImagenLogoNombre: x.ImagenLogoNombre
      }
    });
    this.objetoClientePorUsuario = this.listClientePorUsuario.find(x => {
      return x.Id == this.datosEdi.IdCliente
    });
    this.onSelectCliente(this.objetoClientePorUsuario);
  }

  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
      let ps = new PerfectScrollbar(elemSidebar, {wheelSpeed: 2, suppressScrollX: true});
    }
  }

  isMac(): boolean {
    let bool = false;
    if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
      bool = true;
    }
    return bool;
  }

  onSelectCliente(value: any) {
    
    this.clienteSeleccionado.cartEvent.next(value);
    if (value.ImagenLogoNombre) {
      this.azureService.downloadImage(value.ImagenLogoNombre, blob => {
        var reader = new FileReader();
        reader.onload = () => {
          const dataUrl: any = reader.result;
          const base64 = dataUrl.split(',')[1];
          this.srcLogo = 'data:image/png;base64, ' + base64;
        };
        reader.readAsDataURL(blob);
      })
    }else
    this.srcLogo = "/assets/img/logo-upgrade-white.png";
  }
}
