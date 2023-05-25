import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { BootstrapNotifyBarService } from '@shared/services/bootstrap-notify.service';

@Component({
  selector: 'app-layout-auth',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthLayoutComponent implements OnInit {
  isSubmitted: boolean = false;
  returnUrl: string = '/';
  error: boolean = false;

  form: FormGroup = this.fb.group({
    usuario: [, [Validators.required]],
    password: [, [Validators.required]],
    recaptchaReactive: new FormControl(null, Validators.required)
  })

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
  ) {

  }

  ngOnInit(): void {

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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

  login() {

    if (this.form.invalid) {
      for (const control of Object.keys(this.form.controls)) {
        this.form.controls[control].markAsTouched();
      }
      return;
    }    
    
    this.isSubmitted = true;  
    const loginValues = this.form.value;    
    this.authService.login({
      login: loginValues['usuario'],
      password: loginValues['password'],
      Origen: "2"
    }).then((res: any) => {
      if (res.TipoResultado == 1) {
        var usuarioSession = {
          "Flagproveedor": res.Datos.Flagproveedor,
          "Flagconfiguracionpersona": res.Datos.Flagconfiguracionpersona,
          "Login": res.Datos.Login,
          "Nombre": res.NombreCompleto,
          "ApellidoPaterno": "",
          "ApellidoMaterno": "",
          "Email": res.Datos.Email,
          "NumeroDocumento": res.NumeroDocumento,
          "IdCliente": res.Ubicacion.IdCliente,
          "PermisoPorDefecto": res.PermisoPorDefecto,
          "IdTipoDocumento": res.IdTipoDocumento,
          "Telefono": res.Datos.Telefono,
          "Celular": res.Datos.Celular,
          "Id": res.Id,
          "FechaUltimoAcceso": res.FechaUltimoAcceso,
          //"ClienteDefault": res.ClientesUsuario.filter((x:any) => { return x.IdCliente === dataUsuarioSessionParse.IdCliente }).map(x => { return { Nombre: x.Cliente.Nombre, NombreCorto: x.Cliente.NombreCorto, Id: x.Cliente.Id } })[0]
        };
        var request = {
          usuario: usuarioSession,
          token: res.token
        };
        var encriptdado = this.Encryptar(JSON.stringify(request));
        this.router.navigate(['/dashboard', encriptdado])
      }else{
        this.bootstrapNotifyBarService.notifyDanger(res.Mensaje);
        
      }
      this.isSubmitted = false;
    }, (error: any) => {

      console.log(error);
      this.error = true;
    });



  }

}
