import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthService} from "@core/auth/auth.service";
import {DatePipe} from "@angular/common";
import {SolicitudesService} from "@modules/solicitudes/services/solicitudes.service";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ListavaloresService} from "@shared/services/listavalores.service";

export interface DialogData {
  titulo: string;
  mensaje: string;
  IdsSolicitud: string;
  accion: number;
}

@Component({
  selector: 'app-dialogo-paradareloj',
  templateUrl: './dialogo-paradareloj.component.html',
  styleUrls: ['./dialogo-paradareloj.component.css']
})
export class DialogoParadaRelojComponent implements OnInit {
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public flagMotivoOtros = false;
  submitted = false;
  //datosBasicosFormGroup!: FormGroup;
  listMotivoParadaReloj: any = [];
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEdi: any = {};

  constructor(
    private listavaloresService: ListavaloresService,
    private _formBuilder: UntypedFormBuilder,
    private solicitudesService: SolicitudesService,
    private datePipe: DatePipe,
    private _authService: AuthService,
    public dialogo: MatDialogRef<DialogoParadaRelojComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }

  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }


  listarMotivoParadaReloj() {
    this.listavaloresService.getListaValores({
      idlista: 79,
      idcliente: ""
    }).then((respuesta) => {
      if (respuesta.TipoResultado == 1) {
        this.listMotivoParadaReloj = respuesta.ListaEntidadComun;     
      }
    });
  }

  confirmado(): void {
    this.submitted = true;
    if (!this.datosBasicosFormGroup.valid)
      return;
    this.dialogo.close({
      respuesta: true,
      FechaRegistroAtencion: this.datosBasicosFormGroup.controls["date"].value,//this.datePipe.transform(this.datosBasicosFormGroup.controls["date"].value, 'yyyy-MM-dd HH:mm')
      IdMotivo: this.datosBasicosFormGroup.value.motivoCtrl,
      DescripcionMotivoParada: this.flagMotivoOtros ? this.datosBasicosFormGroup.value.descripcMotivoCtrl : null,
    });
  }

  ngOnInit() {
    this.listarMotivoParadaReloj();
    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      date: new UntypedFormControl(null, [Validators.required]),
      motivoCtrl: ["", [Validators.required]],
    });
  }

  onSelectEventMotivo(value: any) {    
    if (value == 1342) {// otros
      this.flagMotivoOtros = true;
      this.datosBasicosFormGroup.addControl('descripcMotivoCtrl', this._formBuilder.control('', [Validators.required]));
    } else {
      this.flagMotivoOtros = false;
      this.datosBasicosFormGroup.removeControl('descripcMotivoCtrl');
    }
  }
}
