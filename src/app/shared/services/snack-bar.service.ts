import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  //create an instance of MatSnackBar
  private configSuccess: MatSnackBarConfig = {
    panelClass: "success-dialog",
    duration: 5000,
    horizontalPosition: "end",
    verticalPosition: "bottom",
  };
  private configWarning: MatSnackBarConfig = {
    panelClass: "warning-dialog",
    duration: 5000,
    horizontalPosition: "end",
    verticalPosition: "bottom",
  };

  private configDander: MatSnackBarConfig = {
    panelClass: "danger-dialog",
    duration: 5000,
    horizontalPosition: "end",
    verticalPosition: "bottom",
  };
  constructor(private matSnackBar: MatSnackBar) { }

  /* It takes three parameters
      1.the message string
      2.the action
      3.the duration, alignment, etc. */
  public snackbarSuccess(message: any) {
    this.matSnackBar.open(message, 'cerrar', this.configSuccess);
  }
  public snackbarWarning(message: any) {
    this.matSnackBar.open(message, 'cerrar', this.configWarning);
  }
  public snackbarDanger(message: any) {
    this.matSnackBar.open(message, 'cerrar', this.configDander);
  }

  // openSnackBar(message: string, action: string) {
  //   this.snackBar.open(message, action, {
  //     duration: 2000,
  //   });
  // }
}
