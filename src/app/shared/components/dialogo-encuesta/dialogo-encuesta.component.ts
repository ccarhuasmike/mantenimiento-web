import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from "@core/auth/auth.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";

@Component({
  selector: 'app-dialogo-encuesta',
  templateUrl: './dialogo-encuesta.component.html',
  styleUrls: ['./dialogo-encuesta.component.css']
})
export class DialogoEncuestaComponent implements OnInit {
  isLoading = false;
  IdSolicitud: number = 0;
  valorEmojiRating:number=-1;
  datosBasicosFormGroup!: UntypedFormGroup;
  mostrarSelecionMotivo = false;
  constructor(
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService,
    public dialogo: MatDialogRef<DialogoEncuestaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.IdSolicitud = data.IdSolicitud;
  }
  flagemoji: string = "nada";
  mensajeemoji: string = "";
  updateSetting(event: number) {
    this.valorEmojiRating=event;
    
    this.datosBasicosFormGroup.removeControl('motivoCalificacionCtrl');
    this.datosBasicosFormGroup.removeControl('seleccionMotivoCalificacionCtrl');
    switch (event) {
      case 0:
        this.flagemoji = "muymalo"
        this.mensajeemoji = "Muy Malo"
        this.mostrarSelecionMotivo = true;
        this.datosBasicosFormGroup.addControl('motivoCalificacionCtrl', this._formBuilder.control('', [Validators.required]));
        this.datosBasicosFormGroup.addControl('seleccionMotivoCalificacionCtrl', this._formBuilder.control(false, []));
        break;
      case 1:
        this.flagemoji = "malo";
        this.mensajeemoji = "Malo"
        this.mostrarSelecionMotivo = true;
        this.datosBasicosFormGroup.addControl('motivoCalificacionCtrl', this._formBuilder.control('', [Validators.required]));
        this.datosBasicosFormGroup.addControl('seleccionMotivoCalificacionCtrl', this._formBuilder.control(false, []));
        break;
      case 2:
        this.flagemoji = "bueno"
        this.mensajeemoji = "Bueno"
        this.mostrarSelecionMotivo = false;
        break;
      case 3:
        this.flagemoji = "muybueno"
        this.mensajeemoji = "Muy Bueno";
        this.mostrarSelecionMotivo = false;
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
    if (this.valorEmojiRating==-1) {
      this.bootstrapNotifyBarService.notifyWarning("Califique el servicio.");
      return;
    }    
  
    this.dialogo.close({
      respuesta: true,
      request: {
        listSolicitudes: [this.IdSolicitud],
        Puntaje: this.valorEmojiRating,//this.datosBasicosFormGroup.value.rating,
        Comentario: this.datosBasicosFormGroup.value.comentariosCtrl,
        MotivoBajaCalificacion: this.mostrarSelecionMotivo ? this.datosBasicosFormGroup.value.motivoCalificacionCtrl : "",
        GenerarTicketReclamo: this.mostrarSelecionMotivo ? this.datosBasicosFormGroup.value.seleccionMotivoCalificacionCtrl : false
      }
    });
  }
  ngOnInit() {

    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      //rating: ['', Validators.required],
      comentariosCtrl: ['']
    });
  }

}
