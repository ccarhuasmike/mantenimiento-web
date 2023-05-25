import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthService} from "@core/auth/auth.service";
import {DatePipe} from "@angular/common";
import {SolicitudesService} from "@modules/solicitudes/services/solicitudes.service";
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";

export interface DialogData {
  titulo: string;
  mensaje: string;
  IdsSolicitud: string;
  accion: number;
}

@Component({
  selector: 'app-dialogo-regfecha',
  templateUrl: './dialogo-regfecha.component.html',
  styleUrls: ['./dialogo-regfecha.component.css']
})
export class DialogoRegFechaComponent implements OnInit {
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  submitted = false;
  date = new Date();
  datosBasicosFormGroup!: UntypedFormGroup;
  datosEdi: any = {};

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private _authService: AuthService,
    public dialogo: MatDialogRef<DialogoRegFechaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
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
      respuesta: true,
      FechaRegistroAtencion:this.datePipe.transform(this.datosBasicosFormGroup.controls["date"].value, 'yyyy-MM-dd HH:mm:ss')
    });
  }

  ngOnInit() {
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      date: new UntypedFormControl(null, [Validators.required])
    });
  }

}
