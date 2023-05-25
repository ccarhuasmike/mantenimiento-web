import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {AuthService} from "@core/auth/auth.service";
import {UsuarioService} from "@shared/services/usuario.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  datosEdi: any = {};
  constructor(
    private _authService: AuthService,
    private _usuarioService: UsuarioService,
    private route: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
    let valor: any = this.route.snapshot.paramMap.get('id');
    if (valor !== '0') {
      const decoded = atob(valor);
      const original = this.fromBinary(decoded);
      this.datosEdi = JSON.parse(original);
      this._authService.accessEdi = JSON.stringify(this.datosEdi.usuario);
      this._authService.accessToken = this.datosEdi.token;
      /*this._usuarioService.ListarOpcionPorIdUsuario().then((res:any) => {

        this._authService.accessOpcionesPorUsuario=JSON.stringify(res);
      });*/

    }
    //#region Deserializer get encriptado
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
