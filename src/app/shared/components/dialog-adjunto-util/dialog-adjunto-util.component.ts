import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-adjunto-util',
  templateUrl: './dialog-adjunto-util.component.html',
  styleUrls: ['./dialog-adjunto-util.component.css']
})
export class DialogAdjuntoUtilComponent implements OnInit {
  public idRegistro: number = -1;
  public CodigoTabla : number = 1018;
  constructor(
    public dialogRef: MatDialogRef<DialogAdjuntoUtilComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { 
    this.idRegistro=data.idRegistro;
    this.CodigoTabla=data.CodigoTabla;
  }

  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
