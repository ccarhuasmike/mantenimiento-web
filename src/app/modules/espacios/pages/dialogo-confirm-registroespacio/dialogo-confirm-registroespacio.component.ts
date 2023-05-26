import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-confirm-registroespacio',
  templateUrl: './dialogo-confirm-registroespacio.component.html',
  styleUrls: ['./dialogo-confirm-registroespacio.component.css']
})
export class DialogoConfirmRegistroespacioComponent implements OnInit {
  srcFoto:string='./assets/img/ambiente-mibanco/PROCESOS.jpg';
  constructor(
    public dialogo: MatDialogRef<DialogoConfirmRegistroespacioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }
  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }
  confirmarReserva(){
    this.dialogo.close({
      respuesta: true,
    });
  }
}
