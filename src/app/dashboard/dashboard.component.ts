import {Component, OnInit, AfterViewInit} from '@angular/core';
import {AuthService} from "@core/auth/auth.service";

import {ActivatedRoute} from "@angular/router";
import {ClienteService} from '@shared/services/cliente.service';
import {ClientePorUsuarioDto} from '@core/models/ClienteDto';
import {CookieService} from 'ngx-cookie-service';
import {DashboardService} from "@modules/seguridad/services/dashboard.service";
import {types} from "sass";
import List = types.List;
import {AnimationOptions} from "ngx-lottie";
import * as moment from 'moment';

declare const $: any;

interface DasboardModel {
  id: number,
  nombre: string,
  descripcion: string,
  cantidad: number,
  color: string,
  fecha: string
}

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
  modulosDisponibles: DasboardModel[] = [];
  ultimasAcciones: DasboardModel[] = [];
  usoModulos: DasboardModel[] = [];

  public randomIntFromInterval(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  options: AnimationOptions = {
    path: `/assets/animation/chart${this.randomIntFromInterval(0, 2)}.json`, // download the JSON version of animation in your project directory and add the path to it like ./assets/animations/example.json
  };

  optionsCubo: AnimationOptions = {
    path: `/assets/animation/cubo.json`, // download the JSON version of animation in your project directory and add the path to it like ./assets/animations/example.json
  };

  constructor(
    private dashboardService: DashboardService,
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

  public async ngOnInit() {
    moment.locale('es')
    var result = await this.dashboardService.ObtenerDashboard();
    this.modulosDisponibles = result.modulosDisponibles;
    this.ultimasAcciones = result.ultimosAcciones;
    this.usoModulos = result.usoModulos;
  }

  public fechadesde(fecha:any){
    return moment(fecha).fromNow();
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
