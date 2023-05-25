import { DatePipe } from '@angular/common';
import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DatosReloj {
  fechaFin: string;  
  relojCorre:boolean;
}
@Component({
  selector: 'app-dialogo-tiempoatencion',
  templateUrl: './dialogo-tiempoatencion.component.html',
  styleUrls: ['./dialogo-tiempoatencion.component.css']
})
export class DialogoTiempoatencionComponent implements OnInit {
  submitted = false;
  dataReloj!: DatosReloj;
  constructor(     
    private datePipe: DatePipe,
    public dialogo: MatDialogRef<DialogoTiempoatencionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatosReloj
  ) {    
    this.dataReloj= data;
   // this.dataReloj.fechaFin = this.datePipe.transform(data.fechaFin, 'dd/MM/yyyy HH:mm:ss')?.toString() ;
   
  }
  cerrarDialogo(): void {
    this.dialogo.close({
      respuesta: false
    });
  }
  confirmado(): void {   
    this.dialogo.close({    
      respuesta: true
    });
  }
  ngOnInit() {  
  
  }
}
