import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialogo-image',
    templateUrl: './dialogo-image.component.html'
})
export class DialogoImageComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public imagen: any) { }
}