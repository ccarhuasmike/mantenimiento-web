import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from "@core/auth/auth.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from "@angular/forms";
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { EspaciosService } from '@modules/espacios/services/espacio.service';
import { ListavaloresService } from '@shared/services/listavalores.service';

export interface Empresa {
  id: Number;
  razonSocial: string;
}
export interface AreaTrabajo {
  id: Number;
  nombre: string;
}


@Component({
  selector: 'app-dialogo-config-usuarioespacios',
  templateUrl: './dialogo-config-usuarioespacios.component.html',
  styleUrls: ['./dialogo-config-usuarioespacios.component.css']
})
export class DialogoConfigUsuarioEspaciosComponent implements OnInit {
  favoriteSeason!: string;
  seasons: any[] = [{ Id: 29800, Nombre: 'Soy colaborador(a) de Mibanco' }, { Id: 29801, Nombre: 'Soy proveedor / tercero' }];
  isLoading = false;
  IdSolicitud: number = 0;
  listEmpresa: Empresa[] = [];
  listAreaTrabajo: AreaTrabajo[] = [];
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEdi: any = {};
    RegEx_mailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(
    private listavaloresService: ListavaloresService,    
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService,
    private espaciosService: EspaciosService,
    public dialogo: MatDialogRef<DialogoConfigUsuarioEspaciosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.IdSolicitud = data.IdSolicitud;
  }

  radioChange(event: any) {    
    
    this.datosBasicosFormGroup.controls["codigoMatriculaCtrl"].disable();
    this.datosBasicosFormGroup.controls["nombreCtrl"].disable();
    this.datosBasicosFormGroup.controls["apePaternoCtrl"].disable();
    this.datosBasicosFormGroup.controls["apeMaternoCtrl"].disable();
    this.datosBasicosFormGroup.controls["tipoDocumentoCtrl"].disable();
    this.datosBasicosFormGroup.controls["nroDocumentoCtrl"].disable();
    this.datosBasicosFormGroup.controls["empresaCtrl"].disable();
    this.datosBasicosFormGroup.controls["areaCtrl"].disable();
    this.datosBasicosFormGroup.controls["emailCtrl"].disable();

    switch (event.value.Id) {
      case 29800://Soy colaborador Mibanco
      this.datosBasicosFormGroup.controls["codigoMatriculaCtrl"].enable();          
      this.datosBasicosFormGroup.controls["nombreCtrl"].enable();
      this.datosBasicosFormGroup.controls["apePaternoCtrl"].enable();
      this.datosBasicosFormGroup.controls["apeMaternoCtrl"].enable();
      this.datosBasicosFormGroup.controls["tipoDocumentoCtrl"].enable();
      this.datosBasicosFormGroup.controls["nroDocumentoCtrl"].enable();      
      this.datosBasicosFormGroup.controls["areaCtrl"].enable();
      this.datosBasicosFormGroup.controls["emailCtrl"].enable();

        break;
      case 29801://Soy proveedor / tercero      
      this.datosBasicosFormGroup.controls["nombreCtrl"].enable();
      this.datosBasicosFormGroup.controls["apePaternoCtrl"].enable();
      this.datosBasicosFormGroup.controls["apeMaternoCtrl"].enable();
      this.datosBasicosFormGroup.controls["tipoDocumentoCtrl"].enable();
      this.datosBasicosFormGroup.controls["nroDocumentoCtrl"].enable();      
      this.datosBasicosFormGroup.controls["areaCtrl"].enable();
      this.datosBasicosFormGroup.controls["empresaCtrl"].enable();
      this.datosBasicosFormGroup.controls["emailCtrl"].enable();
        break;
    }
    
  }
  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }


  confirmado(): void {
    if (!this.datosBasicosFormGroup.valid)
      return;
    this.dialogo.close({
      respuesta: true,
      request: {
        Flagmibanco: null,//this.datosBasicosFormGroup.value.IdTipoPersonaCtrl.Id===29800 ?  true:false,
        Flagproveedor: this.datosBasicosFormGroup.value.IdTipoPersonaCtrl.Id == 29801 ? true : false,
        Flagconfiguracionpersona: true,
        CIP: this.datosBasicosFormGroup.value.IdTipoPersonaCtrl.Id == 29801 ? "":this.datosBasicosFormGroup.value.codigoMatriculaCtrl,
        Nombre: this.datosBasicosFormGroup.value.nombreCtrl,
        ApellidoPaterno: this.datosBasicosFormGroup.value.apePaternoCtrl,
        ApellidoMaterno: this.datosBasicosFormGroup.value.apeMaternoCtrl,
        IdTipoDocumento: this.datosBasicosFormGroup.value.tipoDocumentoCtrl,
        NroDocumento: this.datosBasicosFormGroup.value.nroDocumentoCtrl,
        IdEmpresa: this.datosBasicosFormGroup.value.IdTipoPersonaCtrl.Id == 29800 ? 0:this.datosBasicosFormGroup.value.empresaCtrl,
        Email: this.datosBasicosFormGroup.value.emailCtrl,
        IdUsuario: this.datosEdi.Id,
        IdTipoPersona: this.datosBasicosFormGroup.value.IdTipoPersonaCtrl.Id,
        IdCliente: this.datosEdi.IdCliente,
        IdAreaTrabajo: this.datosBasicosFormGroup.value.areaCtrl
      }
    });
  }
  ngOnInit() {
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.espaciosService.getAreasTrabajo(this.datosEdi.IdCliente).then((respuesta) => {
      this.listAreaTrabajo = respuesta.success ? respuesta.body : [];
    });

    this.espaciosService.getEmpresa().then((respuesta) => {
      this.listEmpresa = respuesta.success ? respuesta.body : [];
    });
    this.cargarTipoDocumento();

    this.datosBasicosFormGroup = this._formBuilder.group({
      IdTipoPersonaCtrl: ['',Validators.required],
      codigoMatriculaCtrl: ['',Validators.required],
      nombreCtrl: ['', Validators.required],
      apePaternoCtrl: ['', Validators.required],
      apeMaternoCtrl: ['', Validators.required],
      tipoDocumentoCtrl: ['', Validators.required],
      nroDocumentoCtrl: ['', Validators.required],
      empresaCtrl: ['', Validators.required],
      areaCtrl: ['', Validators.required],
      emailCtrl: new FormControl('', [Validators.required, Validators.pattern(this.RegEx_mailPattern)])
    });    
    this.datosBasicosFormGroup.controls["codigoMatriculaCtrl"].disable();
    this.datosBasicosFormGroup.controls["nombreCtrl"].disable();
    this.datosBasicosFormGroup.controls["apePaternoCtrl"].disable();
    this.datosBasicosFormGroup.controls["apeMaternoCtrl"].disable();
    this.datosBasicosFormGroup.controls["tipoDocumentoCtrl"].disable();
    this.datosBasicosFormGroup.controls["nroDocumentoCtrl"].disable();
    this.datosBasicosFormGroup.controls["empresaCtrl"].disable();
    this.datosBasicosFormGroup.controls["areaCtrl"].disable();
    this.datosBasicosFormGroup.controls["emailCtrl"].disable();


  }
  listTipoDocumento: any[] = [];
  cargarTipoDocumento() {
    this.listavaloresService.getListaValores({
      idlista: 4,
      idcliente: ""
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listTipoDocumento = respuesta.ListaEntidadComun;
      }
    });
  }
}
