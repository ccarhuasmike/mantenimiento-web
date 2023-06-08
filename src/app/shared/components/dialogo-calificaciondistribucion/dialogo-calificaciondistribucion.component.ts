import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from "@core/auth/auth.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { BootstrapNotifyBarService } from "@shared/services/bootstrap-notify.service";
import { AdministracionService } from '@shared/services/administracion.service';


@Component({
  selector: 'app-dialogo-calificaciondistribucion',
  templateUrl: './dialogo-calificaciondistribucion.component.html',
  styleUrls: ['./dialogo-calificaciondistribucion.component.css']
})
export class DialogoCalificacionDistribucionComponent implements OnInit {
  isLoading = false;
  IdSolicitud: number = 0;
  valorEmojiRating: number = -1;
  datosBasicosFormGroup!: UntypedFormGroup;  
  constructor(
    private administracionService: AdministracionService,
    private bootstrapNotifyBarService: BootstrapNotifyBarService,
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService,
    public dialogo: MatDialogRef<DialogoCalificacionDistribucionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.IdSolicitud = data.IdSolicitud;
  }
  flagemoji: string = "nada";
  mensajeemoji: string = "";
  updateSetting(event: number) {
    this.valorEmojiRating = event;    
    switch (event) {
      case 0:
        this.flagemoji = "muymalo"
        this.mensajeemoji = "Muy Malo"        
        break;
      case 1:
        this.flagemoji = "malo";
        this.mensajeemoji = "Malo"
        
        break;
      case 2:
        this.flagemoji = "bueno"
        this.mensajeemoji = "Bueno"        
        break;
      case 3:
        this.flagemoji = "muybueno"
        this.mensajeemoji = "Muy Bueno";        
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
    if (this.valorEmojiRating == -1) {
      this.bootstrapNotifyBarService.notifyWarning("Califique satisfacción.");
      return;
    }
    
    const req = {
      CodigoTabla: 1008,
      IdEntidad: this.data.IdDistribucion,
      IdUsuario: this.data.IdUsuario,
      Puntaje: this.valorEmojiRating,
      Comentario: this.datosBasicosFormGroup.value.comentariosCtrl,
    };    
    this.administracionService.Calificar(req).then((res) => {
      
      if (res.TipoResultado === 1) {
        this.bootstrapNotifyBarService.notifySuccess('Info Edi! '+ res.Mensaje);        
        this.dialogo.close({respuesta: true,});
      } else {
        this.dialogo.close({respuesta: false,});
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
