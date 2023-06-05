import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthService} from "@core/auth/auth.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";

export interface DialogData {
  titulo: string;
  mensaje: string;
  IdsSolicitud: string;
  accion: number;
}

@Component({
  selector: 'app-dialogo-rechazardistribucion',
  templateUrl: './dialogo-rechazardistribucion.component.html',
  styleUrls: ['./dialogo-rechazardistribucion.component.css']
})
export class DialogoRechazarDistribucionComponent implements OnInit {
  submitted = false;
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEdi: any = {};
  constructor(
    private _formBuilder: UntypedFormBuilder,
     private _authService: AuthService,
    public dialogo: MatDialogRef<DialogoRechazarDistribucionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

    /*var IdsSolicitud = data.IdsSolicitud.split(",");
    IdsSolicitud.forEach((x) => {
      this.solProcesar.push({Id: parseInt(x)});
    })*/
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
    this.dialogo.close({
      IdsSolicitud: this.data.IdsSolicitud,
      txtComentarioRechazo: this.datosBasicosFormGroup.controls["mytxtComentarioRechazo"].value,
      respuesta: true
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
