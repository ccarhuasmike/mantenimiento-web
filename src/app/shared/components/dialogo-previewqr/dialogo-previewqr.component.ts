import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DatePipe} from "@angular/common";
import {LogAccionService} from "@shared/services/logaccion.service";
import { ReservaModels } from "@core/models/reserva.model";
@Component({
  selector: 'app-dialogo-previewqr',
  templateUrl: './dialogo-previewqr.component.html',
  styleUrls: ['./dialogo-previewqr.component.css']
})
export class DialogoPreviewQRComponent implements OnInit {  
  
  constructor(
    public dialogo: MatDialogRef<DialogoPreviewQRComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReservaModels
  ) {
    
  }
  
  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }

  confirmado(): void {
    this.dialogo.close({
      respuesta: true,
    });
  }

  ngOnInit() {

  }
}
