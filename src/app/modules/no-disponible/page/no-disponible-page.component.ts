import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {AuthService} from "@core/auth/auth.service";
import {UsuarioService} from "@shared/services/usuario.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-no-disponible-page',
  templateUrl: './no-disponible-page.component.html',
  styleUrls: ['./no-disponible-page.component.css']
})
export class NoDisponiblePageComponent implements OnInit {
  datosEdi: any = {};
  constructor(
    private _authService: AuthService,
    private _usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    localStorage.clear();

  }

}
