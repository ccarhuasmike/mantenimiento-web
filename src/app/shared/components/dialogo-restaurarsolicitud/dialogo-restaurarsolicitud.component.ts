import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AuthService} from "@core/auth/auth.service";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import { SolicitudesService } from '@modules/solicitudes/services/solicitudes.service';
import { DialogoConfirmacionComponent } from '../dialogo-confirmacion/dialogo-confirmacion.component';
import { MatDialog } from "@angular/material/dialog";
export interface DialogData {
  titulo: string;
  mensaje: string;
  IdEstadoActual:number;
  codigoSolicitud:string;
  estadoActual:string;
  IdsSolicitud: string;
  accion: number;
}

@Component({
  selector: 'app-dialogo-restaurarsolicitud',
  templateUrl: './dialogo-restaurarsolicitud.component.html',
  styleUrls: ['./dialogo-restaurarsolicitud.component.css']
})
export class DialogoRestaurarSolicitudComponent implements OnInit {
  submitted = false;
  datosBasicosFormGroup!: UntypedFormGroup;
  listNuevoEstado: any = [];
  datosEdi: any = {};
  
  constructor(
    public dialogoConfir: MatDialog,
    private solicitudesService: SolicitudesService,
    private _formBuilder: UntypedFormBuilder,
     private _authService: AuthService,
    public dialogo: MatDialogRef<DialogoRestaurarSolicitudComponent>,    
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
  }
  listarNuevoEstado() {
    
    this.solicitudesService.getListarNuevosEstado(this.data.IdEstadoActual).then((response) => {  
                
      this.listNuevoEstado = response.ListaEntidadComun;
    });
    // this.listavaloresService.getListaValores({
    //   idlista: eLista.EstadoSolicitud,
    //   idcliente: ""
    // }).then((respuesta) => {
    //   if (respuesta.TipoResultado == 1) {
    //     this.listNuevoEstado = respuesta.ListaEntidadComun;
    //   }
    // });
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
        mensaje: `¿Está seguro de restaurar el estado de la solicitud?`
      }
    })
      .afterClosed()
      .subscribe(async (confirmado: Boolean) => {
        if (confirmado) {          
          this.dialogo.close({
            IdsSolicitud: this.data.IdsSolicitud,
            IdEstado: this.datosBasicosFormGroup.controls["estadoNuevoCtrl"].value,
            respuesta: true
          });
        }
      });

   
  }

  ngOnInit() {
    this.datosEdi = JSON.parse(this._authService.accessEdi);
    this.listarNuevoEstado();
    //Inicializacion de form group
    this.datosBasicosFormGroup = this._formBuilder.group({
      codigoSolicitudCtrl: ["", [Validators.required]],
      estadoActualCtrl: ["", Validators.required],
      estadoNuevoCtrl: ["", Validators.required],
    });
    this.datosBasicosFormGroup.patchValue({
      codigoSolicitudCtrl:this.data.codigoSolicitud,
      estadoActualCtrl: this.data.estadoActual
    });
    this.datosBasicosFormGroup.controls["codigoSolicitudCtrl"].disable();
    this.datosBasicosFormGroup.controls["estadoActualCtrl"].disable();    
  }
}
