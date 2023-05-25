import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from "@core/auth/auth.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DialogoConfirmacionComponent } from '../dialogo-confirmacion/dialogo-confirmacion.component';
export interface DialogData {
  titulo: string;
  mensaje: string;
  IdsSolicitud: string;
  accion: number;
}

@Component({
  selector: 'app-dialogo-anularsolicitud',
  templateUrl: './dialogo-anularsolicitud.component.html',
  styleUrls: ['./dialogo-anularsolicitud.component.css']
})
export class DialogoAnularSolicitudComponent implements OnInit {
  submitted = false;
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEdi: any = {};
  constructor(
    public dialogoConfir: MatDialog,
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService,
    public dialogo: MatDialogRef<DialogoAnularSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    //
  }
  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }

  confirmado(): void {
    this.submitted = true;
    if (!this.datosBasicosFormGroup.valid)
      return;

    this.dialogoConfir.open(DialogoConfirmacionComponent, {
      maxWidth: '25vw',
      maxHeight: 'auto',
      height: 'auto',
      width: '25%',
      disableClose: true,
      data: {
        titulo: `Mensaje de Confirmación`,
        mensaje: `¿Está seguro de anular las solicitudes seleccionadas?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {
          this.dialogo.close({
            IdsSolicitud: this.data.IdsSolicitud,
            txtComentarioRechazo: this.datosBasicosFormGroup.controls["mytxtComentarioRechazo"].value,
            respuesta: true
          });
        }
      });
  }

  ngOnInit() {
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      mytxtComentarioRechazo: ['', [Validators.required]]
    });
  }

}
